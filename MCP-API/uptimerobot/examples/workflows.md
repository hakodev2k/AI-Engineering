# Workflows

- `uptimerobot.monitor.list` — `{ "maxPages": 2 }` → monitor array; READ; no approval.
- `uptimerobot.monitor.get` — `{ "id": "123" }` → monitor object; READ; no approval.
- `uptimerobot.monitor.create` — `{ "friendlyName":"API", "url":"https://example.com/health", "type":"http", "approved":true }` → created monitor; WRITE; approval configurable.
- `uptimerobot.monitor.pause` — `{ "id":"123", "approved":true }` → updated monitor; WRITE; approval configurable.
- `uptimerobot.monitor.delete` — `{ "id":"123", "approved":true }` → deletion result; DESTRUCTIVE; explicit approval and opt-in required.
