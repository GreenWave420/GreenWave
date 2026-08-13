# GreenWave — Cultivation Facility Operations

Standard Operating Procedures (SOPs) and routine task checklists for running the
GreenWave cannabis cultivation facility.

These documents are written to support a licensed medicinal cultivation
operation and are structured to align with **GACP** (Good Agricultural and
Collection Practice) and **GMP** hygiene expectations relevant to New Zealand
Medsafe-licensed cultivation. Adapt the specific values (setpoints, product
names, room IDs, staff roles) to your licence and site.

> ⚠️ **Compliance note:** Nothing here replaces your site licence conditions,
> your quality manual, or advice from your Responsible Person / Quality lead.
> Where a checklist item touches a regulated activity (waste destruction,
> security, record retention), follow your approved master SOP if it differs.

---

## How to use these documents

- **Print the checklists** (or load them into your task app) and have staff
  **initial and time-stamp** each completed item. Signed checklists are your
  audit evidence.
- Every task references a **detailed SOP** in `/sops` where the "how" and the
  "why" live. The checklist is the *reminder*; the SOP is the *method*.
- **If it isn't recorded, it didn't happen.** Log readings, corrective actions,
  and anything abnormal in the room logbook or batch record.
- Review and re-sign these SOPs at least **annually**, or whenever a process,
  input, or regulation changes.

---

## Document index

### Routine checklists (`/checklists`)
| Cadence | File | Purpose |
|---|---|---|
| Daily | [daily-checklist.md](checklists/daily-checklist.md) | Everyday plant care, environment, hygiene, security |
| Weekly | [weekly-checklist.md](checklists/weekly-checklist.md) | Deeper cleaning, IPM scouting, mother/veg work, stock |
| Monthly | [monthly-checklist.md](checklists/monthly-checklist.md) | Deep sanitation, calibration, compliance, maintenance |

### Ops brain (`/brain`)

[`brain/index.html`](brain/index.html) is a single-file visual map of the facility's
operating domains — climate, irrigation, IPM, harvest, compliance and the rest —
arranged around a central core. Tap a node to see who owns it and which SOP
governs it.

> The readouts on each node are **illustrative sample values**, not live telemetry.
> Nothing here reads a sensor. Treat it as a wall display and an index into the
> SOPs, not as a source of record.

**Apex, the voice assistant.** The bar at the bottom talks to Claude or GPT
(switch with the model chip). Type a question, or press the mic and speak — the
waveform and the core follow your actual microphone level, and the reply is read
back aloud. Apex is briefed with every node on the board, its owner, its governing
SOP, and the target ranges below, so it answers about *this* facility.

To use it:

1. Serve the folder over `http://localhost` rather than opening the file directly —
   microphone access and speech recognition need a secure context, and the API
   calls need a real origin. Any static server works: `npx serve brain` or
   `python3 -m http.server -d brain`.
2. Click the gear and paste an Anthropic and/or OpenAI API key.

> ⚠️ **Key handling in local mode.** Opened this way there is no server — the page
> calls the provider directly from the browser and your key sits in that browser's
> localStorage. Use a key issued for this purpose that you can revoke, and don't
> enter one on a shared machine. Speech recognition also sends audio to the browser
> vendor's service. For anything shared, host it instead (below) — the key then
> stays server-side and viewers never see it.

### Hosting Apex

`worker/` holds a small proxy that serves the page *and* relays Apex's questions,
keeping the API key in a server secret. The page detects it automatically: the key
fields disappear from settings and it asks for an access code instead. Two ways to
deploy it, sharing the same handler in `worker/apex.js`.

**Cloudflare Pages — no terminal required.** Everything below is done in a browser,
so this works from a phone.

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**,
   pick this repository and branch.
2. Build settings: framework preset **None**, build command **blank**, build output
   directory **`brain`**. Save and deploy.
3. **Settings → Environment variables**, add and encrypt:
   - `ANTHROPIC_API_KEY` — your `sk-ant-…` key
   - `APEX_ACCESS_CODE` — any passphrase (see the warning below)
   - optional: `OPENAI_API_KEY`, `CLAUDE_MODEL`, `GPT_MODEL`
4. Redeploy so the variables take effect, open the `*.pages.dev` URL, tap the gear
   and enter the access code once.

**Cloudflare Worker — with a terminal.**

```
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put APEX_ACCESS_CODE
npx wrangler deploy
```

> ⚠️ **Set an access code.** Without `APEX_ACCESS_CODE` the URL is an open relay to
> your API key — anyone who finds it can spend your credits. With it set, every
> request must carry the code or the proxy returns 401. The proxy also pins the
> model, caps output at 1024 tokens, and trims history to 12 turns, so a single
> leaked page can't run away with the bill.

### Detailed SOPs (`/sops`)
| SOP | File |
|---|---|
| Cleaning & Sanitation | [sops/cleaning-and-sanitation.md](sops/cleaning-and-sanitation.md) |
| Mother Plant Maintenance | [sops/mother-plant-maintenance.md](sops/mother-plant-maintenance.md) |
| Trimming & Harvest Handling | [sops/trimming-and-harvest.md](sops/trimming-and-harvest.md) |
| Integrated Pest Management (IPM) | [sops/integrated-pest-management.md](sops/integrated-pest-management.md) |
| Facility Tidying & Housekeeping | [sops/facility-tidying.md](sops/facility-tidying.md) |

---

## Operating model (Finance node)

Internal only. NZD, excl. GST, three founders. Shared across every version of the
model: five harvests a year, 44 kg dry per harvest at $4.00/g — $176,000 a
harvest, $880,000 a year; company tax at 28%; 60% of after-tax profit distributed,
40% retained. Build fit-out, plant and licence were founder-funded and sit outside
operating costs.

**Two versions of the cost side are in circulation and they do not agree.** The
Finance node on the ops brain carries the newer set.

| | Monthly cost | Cost / harvest | Profit / harvest | After tax | Per founder | Cost / g |
|---|---|---|---|---|---|---|
| **Newer** — *Monthly Costs & Projected Income*, *One Company* | $33,635 | $75,080 | $100,920 | $341,330 | $68,300 | $1.71 |
| **Older** — *Financial Breakdown*, *Investor One-Pager*, *Supply Activity Projection* | $28,600 | $62,950 | $113,050 | $386,800 | $77,400 | $1.43 |

The newer set describes itself as the correction: wages are grossed up to $18,850
for PAYE, ACC and KiwiSaver (the older set uses a flat $14,000), nutrients are
priced at $3,816 a run "replacing the earlier $25k/yr estimate", and a $2,250/yr
Medsafe licence line is added. Every one of those moves the cost up.

The gap is roughly **$9,100 per founder per year**. Until the three older
documents are updated, quote the newer set and say so — do not blend the two.

---

## Standard target ranges (edit to your setup)

These are **placeholder defaults** — confirm against your strains, genetics and
licence, then lock them in.

| Zone | Temp (day) | Temp (night) | RH | CO₂ | VPD |
|---|---|---|---|---|---|
| Mothers / Veg | 22–26 °C | 20–22 °C | 55–65 % | 800–1200 ppm | 0.8–1.1 kPa |
| Early Flower | 24–26 °C | 20–22 °C | 50–60 % | 1000–1400 ppm | 1.0–1.2 kPa |
| Late Flower | 20–24 °C | 18–20 °C | 40–50 % | ambient–1000 ppm | 1.2–1.5 kPa |
| Drying room | 16–20 °C | — | 55–62 % | ambient | — |

| Input | Target |
|---|---|
| Nutrient solution pH | 5.8–6.2 |
| Nutrient solution EC | Per feed schedule / growth stage |
| Irrigation water source EC | < 0.4 mS/cm before nutrients |
| Runoff EC monitoring | Daily in flower |

---

## Roles referenced in these documents

| Abbrev. | Role |
|---|---|
| GM | Grower / Cultivation Manager |
| CT | Cultivation Technician |
| IPM | IPM / Crop Health lead |
| QA | Quality / Compliance lead |
| RP | Responsible Person (licence holder contact) |

Assign real names to these on your printed master copy.
