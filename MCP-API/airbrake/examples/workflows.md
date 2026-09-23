# Airbrake workflows

## Investigate an incident

1. `airbrake.project.list` — `{ "page": 1, "limit": 20 }` — READ, no approval.
2. `airbrake.group.list` — `{ "projectId": 123, "page": 1, "limit": 20, "order": "last_notice" }` — READ, no approval.
3. `airbrake.group.get` — `{ "projectId": 123, "groupId": 456 }` — READ, no approval.
4. `airbrake.notice.list` — `{ "projectId": 123, "groupId": 456, "page": 1, "limit": 20 }` — READ, no approval.

Expected outputs are the corresponding Airbrake JSON project/group/notice collections or objects.

## Temporarily mute a noisy group

`airbrake.group.mute` — `{ "projectId": 123, "groupId": 456, "approved": true }` — WRITE, explicit approval required and writes must be enabled. Expected output: `{ "ok": true }` on Airbrake HTTP 204. Use `airbrake.group.unmute` with the same approval boundary to restore notifications.

## Register a deploy

`airbrake.deploy.create` input:
```json
{ "projectId": 123, "environment": "production", "repository": "https://example.com/org/repo", "revision": "abc123", "version": "v1.2.3", "approved": true }
```
Risk: WRITE. Approval: required. The connector uses `AIRBRAKE_PROJECT_KEY`; never include a key in tool input. Expected output is Airbrake's deploy creation response.
