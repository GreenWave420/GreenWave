/**
 * Cloudflare Pages entry — same proxy, no terminal required.
 *
 * Pages serves brain/ as the static site and routes /api/* here. Connect the
 * repo in the Cloudflare dashboard, set the build output directory to `brain`,
 * and add ANTHROPIC_API_KEY / APEX_ACCESS_CODE as environment variables.
 */

import { handleApi } from '../../worker/apex.js';

export async function onRequest({ request, env }) {
  const handled = await handleApi(request, env);
  return handled || new Response('Not found', { status: 404 });
}
