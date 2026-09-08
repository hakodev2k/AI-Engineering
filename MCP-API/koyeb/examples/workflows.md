# Workflow examples

## Inspect an app
1. `koyeb.app.list` — `{ "limit": 20 }` — READ — no approval.
2. `koyeb.service.list` — `{ "app_id": "<uuid>" }` — READ — no approval.
3. `koyeb.deployment.list` — `{ "service_id": "<uuid>" }` — READ — no approval.
4. `koyeb.instance.list` — `{ "service_id": "<uuid>" }` — READ — no approval.

## Controlled lifecycle action
`koyeb.app.pause` with `{ "id": "<uuid>", "approved": true }` is HIGH_RISK and must only be called after explicit human approval.

## Secret management
`koyeb.secret.create` accepts `{ "name": "DB_PASSWORD", "value": "...", "approved": true }`. The secret value stays in the connector call path and must not be placed in prompts or logs. `koyeb.secret.delete` is DESTRUCTIVE and additionally requires `KOYEB_ENABLE_DESTRUCTIVE=true`.
