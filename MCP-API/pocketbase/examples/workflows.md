# PocketBase connector workflow examples

## Inspect application data

1. `pocketbase.health.check` with `{}` — READ — no approval.
2. `pocketbase.record.list` with `{ "collection": "posts", "page": 1, "perPage": 20 }` — READ — no connector approval; PocketBase ListRule still applies.
3. `pocketbase.record.get` with `{ "collection": "posts", "id": "RECORD_ID" }` — READ.

Expected output shape: `{ "provider": "pocketbase", "untrusted_data": true, "result": ... }`.

## Create and update a record

`pocketbase.record.create` input:

```json
{ "collection": "tasks", "data": { "title": "Review incident", "status": "open" }, "approved": true }
```

Risk: WRITE. Approval: required by default. PocketBase CreateRule remains authoritative.

`pocketbase.record.update` input:

```json
{ "collection": "tasks", "id": "RECORD_ID", "data": { "status": "done" }, "approved": true }
```

Risk: WRITE. Approval: required by default.

## Backup operations

`pocketbase.backup.create` with `{ "name": "agent_safe_backup.zip", "approved": true }` is HIGH_RISK.

`pocketbase.backup.restore` requires both destructive mode and explicit approval:

```json
{ "key": "agent_safe_backup.zip", "acknowledgement": "RESTORE_AND_RESTART", "approved": true }
```

Risk: DESTRUCTIVE. `POCKETBASE_ENABLE_DESTRUCTIVE=true` must also be configured by an operator.
