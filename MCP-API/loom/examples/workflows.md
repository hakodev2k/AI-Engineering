# Loom connector workflows

## Read a meeting
Tool: `loom.recording.get` with `{ "recordingId": "..." }` (READ, no approval), then `loom.transcript.get` and `loom.action_item.list`.

Expected output is MCP content containing `{ "source": "untrusted-provider-data", "data": ... }`.

## Give feedback
Tool: `loom.comment.create` with `{ "recordingId": "...", "text": "Looks good; please clarify the rollout step.", "approved": true }`.
Permission: WRITE. Approval: required because this sends an external message.

## Organize a recording
Tool: `loom.recording.move` with `{ "recordingId": "...", "folderId": "...", "approved": true }`.
Permission: WRITE. Approval: required.
