# SLO and Error Budget Playbook

## Core Model
SLIs measure user-relevant reliability; SLOs set objectives over a window; error budget is the allowed unreliability.

For availability SLO `S`, allowed bad fraction is `1-S`. Example: 99.9% permits 0.1% failed eligible events in the window. Event-based accounting is often more useful than translating immediately into downtime minutes.

## Good SLI Properties
- Close to user experience.
- Computable from a stable source.
- Resistant to misleading averaging.
- Has explicit eligibility/exclusions.
- Can be reproduced outside the dashboard.

## Burn Rate
Burn rate compares observed bad-event rate with the allowed bad-event rate. `1x` consumes budget exactly at the sustainable rate; higher values consume faster. Multi-window alerts reduce noise while detecting fast and slow burns.

## Policy Guidance
Healthy budget does not justify careless releases. Exhausted budget does not mean all delivery stops; reliability fixes, security patches, and urgent business actions may still proceed with explicit risk control.

## Common Failures
- SLO based on CPU rather than user success.
- Excluding exactly the failures users care about.
- Global average hiding a critical tenant/region.
- Paging on every SLO miss instead of actionable burn.
- Changing the SLO to make history look better.

## Review Questions
What user promise is represented? Can the SLI lie during a known failure? Who owns the consequence of burn? What decision changes when budget is low?