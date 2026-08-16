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
| Dehumidifiers all off | RH > setpoint + 8 % for 10 min **and** all four dehumidifier relays off | RH back within 5 % of setpoint |

The threshold **follows the RH dial** — the "Grow Room Dehumidifiers" control on
the Environment dashboard (`humidifier.grow_room_dehumidifiers`, target read
from its `humidity` attribute). Move the dial and the alarm point moves with it;
there is no fixed number to keep in sync. At the current setpoint of 68 % the
alert fires above 76 %.

The margin is what makes the alert mean something. The control loop routinely
lets the room sit a little above setpoint while it catches up; that is normal
operation, not a fault. Alarming at setpoint + 0 pages on every overshoot, which
is what made the original alert unreadable.

To retune, edit the `+ 8` in the trigger template and the `+ 5` in the
`wait_template` at the bottom of the automation. They are written inline because
Home Assistant does not expose automation `variables:` to template triggers —
keep the re-arm margin the smaller of the two or the alert will flap.

Routine RH drift belongs in the daily checklist and the climate control loop,
not in a critical push notification.
