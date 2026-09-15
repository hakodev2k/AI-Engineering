# Umami MCP workflow examples

## Traffic investigation
1. `umami.website.list` — `{ "page": 1, "pageSize": 20 }` — READ — no approval.
2. `umami.analytics.stats` — `{ "websiteId": "<uuid>", "startAt": 0, "endAt": 1 }` — READ — no approval. Use real millisecond timestamps where `endAt > startAt`.
3. `umami.analytics.metrics` — select `path`, `referrer`, `country`, `device`, or another supported dimension — READ.
4. `umami.event.stats` and `umami.event.list` — investigate conversions/events — READ.
5. `umami.realtime.get` — inspect the last 30 minutes — READ.

## Website administration
`umami.website.create` and `umami.website.update` are WRITE operations and require `UMAMI_ALLOW_WRITES=true` plus `approved:true`.

`umami.website.delete` is DESTRUCTIVE. It additionally requires `UMAMI_ALLOW_DESTRUCTIVE=true`, `approved:true`, and an exact duplicate `confirmWebsiteId`. Expected output is wrapped as `{ "untrusted_provider_data": true, "data": ... }` so provider data is never treated as instructions.
