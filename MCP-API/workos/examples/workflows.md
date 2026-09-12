# WorkOS connector workflows

## Inspect an enterprise tenant

1. `workos.organization.list` — input `{ "search": "Acme", "limit": 20 }`; permission `READ`; approval `none`.
2. `workos.organization.get` — input `{ "organizationId": "org_..." }`; permission `READ`; approval `none`.
3. `workos.directory.list` — input `{ "organizationId": "org_...", "limit": 20 }`; permission `READ`; approval `none`.
4. `workos.directory_user.list` — input `{ "directoryId": "directory_...", "limit": 50 }`; permission `READ`; approval `none`.
5. `workos.directory_group.list` — input `{ "userId": "directory_user_..." }`; permission `READ`; approval `none`.

Expected output is a JSON object wrapped as MCP text content with `trust: "untrusted-provider-data"` and the provider response in `data`.

## Consume synchronization events

Call `workos.event.list` with `{ "events": ["dsync.user.created", "dsync.user.updated"], "limit": 100 }`. Permission is `READ`; approval is not required. Persist the returned cursor externally if your agent needs incremental synchronization.

## Emit an audit event

Call `workos.audit_event.create` only after a human explicitly approves the write and the runtime sets `WORKOS_WRITE_APPROVED=true`.

Example input:

```json
{
  "organizationId": "org_01EXAMPLE",
  "idempotencyKey": "884793cd-bef4-46cf-8790-e3d4957a09ce",
  "event": {
    "action": "document.viewed",
    "occurred_at": "2026-09-12T12:00:00.000Z",
    "actor": { "type": "user", "id": "user_01EXAMPLE" },
    "targets": [{ "type": "document", "id": "doc_123" }]
  }
}
```

Permission is `WRITE`; approval is `explicit-human`. The action and target schema must already exist in WorkOS Audit Logs.
