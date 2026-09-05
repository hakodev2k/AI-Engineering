# Plausible connector workflows

## Traffic investigation
1. `plausible.site.get` with `{ "siteId": "example.com" }` — READ, no approval.
2. `plausible.stats.query` with `{ "siteId":"example.com", "metrics":["visitors","pageviews"], "dateRange":"30d", "dimensions":["time:day"] }` — READ, no approval.

Expected output is the provider JSON wrapped with connector metadata.

## Configure a conversion goal
1. Inspect `plausible.goal.list`.
2. Prepare `plausible.goal.ensure` for the desired event/page goal.
3. Approve exact fingerprint such as `plausible.goal.ensure:example.com:Signup` when write approvals are enabled.

## Server-side event
`plausible.event.track` is HIGH_RISK because it changes analytics data. The domain must be in `PLAUSIBLE_ALLOWED_SITES` and exact approval such as `plausible.event.track:example.com:Purchase` is required.

## Destructive cleanup
`plausible.site.delete`, `plausible.goal.delete`, `plausible.custom_property.delete`, and `plausible.guest.remove` require both `PLAUSIBLE_ALLOW_DESTRUCTIVE=true` and an exact approval fingerprint.
