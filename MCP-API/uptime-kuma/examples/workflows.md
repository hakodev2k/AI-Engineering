# Workflow examples

## Incident inspection
1. `uptime_kuma.monitor.list` `{}` — READ, no approval.
2. `uptime_kuma.monitor.get` `{"id":12}` — READ, no approval.
3. `uptime_kuma.heartbeat.list` `{"id":12,"period":24}` — READ, no approval.

Expected outputs are JSON envelopes containing provider data and `security.content_is_untrusted=true`.

## Controlled maintenance
1. Inspect monitor with `uptime_kuma.monitor.get`.
2. `uptime_kuma.monitor.pause` `{"id":12,"approved":true}` — HIGH_RISK; requires connector write enablement and explicit approval.
3. `uptime_kuma.monitor.resume` `{"id":12,"approved":true}` — WRITE; requires approval.

## Create HTTP monitor
`uptime_kuma.monitor.create` with `{"approved":true,"type":"http","name":"Public API","url":"https://example.com/health","interval":60}` — WRITE; requires approval.

Deletion additionally requires `UPTIME_KUMA_ALLOW_DESTRUCTIVE=true`.