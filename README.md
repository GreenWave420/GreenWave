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

> ⚠️ **Key handling.** There is no server in this project — the page calls the
> provider directly from the browser, and your key is stored in that browser's
> localStorage. Use a key issued for this purpose that you can revoke, and don't
> enter one on a shared or public machine. Speech recognition also sends audio to
> the browser vendor's service. If Apex is going on a shared floor terminal, put a
> small proxy in front of it and hold the key server-side instead.

### Detailed SOPs (`/sops`)
| SOP | File |
|---|---|
| Cleaning & Sanitation | [sops/cleaning-and-sanitation.md](sops/cleaning-and-sanitation.md) |
| Mother Plant Maintenance | [sops/mother-plant-maintenance.md](sops/mother-plant-maintenance.md) |
| Trimming & Harvest Handling | [sops/trimming-and-harvest.md](sops/trimming-and-harvest.md) |
| Integrated Pest Management (IPM) | [sops/integrated-pest-management.md](sops/integrated-pest-management.md) |
| Facility Tidying & Housekeeping | [sops/facility-tidying.md](sops/facility-tidying.md) |

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
