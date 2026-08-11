/**
 * Apex's server side: the model keys live here, not in the browser.
 *
 * Shared by both deployment shapes — worker/index.js (Cloudflare Worker,
 * deployed with wrangler) and functions/api/[[path]].js (Cloudflare Pages,
 * deployable from the dashboard with no terminal). Returns null for any path
 * that isn't ours so the caller can fall through to the static page.
 */

const UPSTREAM = {
  claude: 'https://api.anthropic.com/v1/messages',
  gpt: 'https://api.openai.com/v1/chat/completions',
};

const DEFAULT_MODEL = { claude: 'claude-opus-5', gpt: 'gpt-5' };

// Keeps a stray tab — or a scraper that finds the URL — from running up a bill.
const MAX_TOKENS = 1024;
const MAX_TURNS = 12;
const MAX_SYSTEM = 20000;
const MAX_CHARS = 4000;

export async function handleApi(request, env) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/health') return health(env);
  if (pathname === '/api/claude') return ask(request, env, 'claude');
  if (pathname === '/api/gpt') return ask(request, env, 'gpt');
  return null;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

/** Lets the page discover it is behind a proxy, and which side is wired up. */
function health(env) {
  return json({
    proxy: true,
    needsCode: Boolean(env.APEX_ACCESS_CODE),
    providers: {
      claude: Boolean(env.ANTHROPIC_API_KEY),
      gpt: Boolean(env.OPENAI_API_KEY),
    },
  });
}

/** Length-safe compare, so the code can't be guessed a character at a time. */
function codeMatches(given, expected) {
  const enc = new TextEncoder();
  const a = enc.encode(given);
  const b = enc.encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function ask(request, env, provider) {
  if (request.method !== 'POST') return json({ error: { message: 'POST only.' } }, 405);

  if (env.APEX_ACCESS_CODE &&
      !codeMatches(request.headers.get('x-apex-code') || '', env.APEX_ACCESS_CODE)) {
    return json({ error: { message: 'Wrong or missing access code.' } }, 401);
  }

  const key = provider === 'claude' ? env.ANTHROPIC_API_KEY : env.OPENAI_API_KEY;
  if (!key) return json({ error: { message: `No ${provider} key is configured on the server.` } }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: { message: 'Bad JSON.' } }, 400); }

  const system = String(body.system || '').slice(0, MAX_SYSTEM);
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-MAX_TURNS)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!messages.length) return json({ error: { message: 'No messages.' } }, 400);

  // Model, token ceiling and effort are decided here, not by the caller.
  const send = provider === 'claude'
    ? fetch(UPSTREAM.claude, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: env.CLAUDE_MODEL || DEFAULT_MODEL.claude,
          max_tokens: MAX_TOKENS,
          system,
          output_config: { effort: 'low' },
          messages,
          stream: true,
        }),
      })
    : fetch(UPSTREAM.gpt, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: env.GPT_MODEL || DEFAULT_MODEL.gpt,
          messages: [{ role: 'system', content: system }, ...messages],
          stream: true,
        }),
      });

  let res;
  try {
    res = await send;
  } catch (err) {
    return json({ error: { message: `Could not reach ${provider}: ${err.message}` } }, 502);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return json({ error: { message: `${provider} returned ${res.status}. ${detail.slice(0, 400)}` } }, res.status);
  }

  // Hand the provider's SSE stream straight back to the page.
  return new Response(res.body, {
    status: 200,
    headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store' },
  });
}
