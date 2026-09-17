# Workflow examples

## Diagnose an outage
1. `updown.check.list` — `{}` — READ — no approval.
2. `updown.check.get` — `{"token":"abcd","results":true}` — READ — no approval.
3. `updown.check.downtimes` — `{"token":"abcd","page":1}` — READ — no approval.
4. `updown.check.metrics` — `{"token":"abcd","group":"host"}` — READ — no approval.
Expected outputs are JSON provider objects wrapped as `{data, untrusted_provider_content:true}`.

## Create a monitor
`updown.check.create` with `{"input":{"url":"https://example.com/health","period":60,"alias":"API health"},"approved":true}` — WRITE — approval required by default.

## Publish a status page
`updown.status_page.create` with `{"input":{"checks":["abcd"],"name":"Public status","visibility":"public"},"approved":true}` — HIGH_RISK — explicit approval required.

## Delete a check
`updown.check.delete` with `{"token":"abcd","approved":true}` — DESTRUCTIVE — requires both `UPDOWN_DESTRUCTIVE_ENABLED=true` and explicit approval.
