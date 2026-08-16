# Home Assistant — alert configuration

Reference copies of the Home Assistant automations that page staff about grow
room conditions. Home Assistant remains the source of truth; these files exist
so the alert thresholds are reviewable and version-controlled alongside the
SOPs they enforce.

| File | Purpose |
|---|---|
| [rh-dehumidifier-alert.yaml](rh-dehumidifier-alert.yaml) | Critical push when RH is high and no dehumidifier is running |

## Applying a change

1. In Home Assistant, open **Settings → Automations & Scenes**.
2. Find the automation, open the ⋮ menu, and choose **Edit in YAML**.
3. Paste the body from the file here (everything below the `- id:` line, without
   the leading `- `, if you are editing a single automation in the UI editor).
4. Save, then **Developer Tools → YAML → Reload Automations**.

Before pasting, confirm the entity IDs against **Developer Tools → States** and
set the `notify.mobile_app_*` service to the right handset — those differ per
install and are left as placeholders in the YAML.

## Current thresholds

| Alert | Fires when | Re-arms |
|---|---|---|
| Dehumidifiers all off | RH > 75 % for 10 min **and** all four dehumidifier relays off | RH back below 72 % |

75 % is a fixed fault threshold, independent of the RH dial. It means
dehumidification has failed, not that the room is drifting off setpoint. Moving
the dial does not move it.

The original alert paged whenever RH sat above the control setpoint with the
relays off — a normal idle state, since the relays are correctly off any time
the room is below target. It fired hourly in the low-to-mid 60s and carried no
information.

Routine RH drift belongs in the daily checklist and the climate control loop,
not in a critical push notification.

Routine RH drift belongs in the daily checklist and the climate control loop,
not in a critical push notification.
