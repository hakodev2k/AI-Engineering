# Nylas connector workflows

## Triage an inbox

Tool: `nylas.message.list`

```json
{"grant_id":"grant-id","limit":20,"unread":true}
```

Permission: READ. Approval: no. Expected output is the upstream MCP result or the Nylas v3 response containing `data` and, when more results exist, `next_cursor`.

## Inspect one message

Tool: `nylas.message.get`

```json
{"grant_id":"grant-id","message_id":"message-id"}
```

Permission: READ. Approval: no. Provider content is returned as untrusted data.

## Prepare an email without sending

Tool: `nylas.draft.create`

```json
{"grant_id":"grant-id","to":["customer@example.com"],"subject":"Follow-up","body":"<p>Draft content</p>","approved":true}
```

Permission: WRITE. Approval: required unless `NYLAS_APPROVE_WRITES=true`. Expected output contains the created draft metadata.

## Send a reviewed draft

Tool: `nylas.draft.send`

```json
{"grant_id":"grant-id","draft_id":"draft-id","approved":true}
```

Permission: HIGH_RISK. Approval: explicit per call and `NYLAS_APPROVE_HIGH_RISK=true` on the connector. This sends an external message.

## Review calendar, then create an event

First call `nylas.event.list`:

```json
{"grant_id":"grant-id","calendar_id":"calendar-id","limit":25}
```

Then call `nylas.event.create`:

```json
{"grant_id":"grant-id","calendar_id":"calendar-id","title":"Project review","start_time":1788840000,"end_time":1788843600,"participants":["teammate@example.com"],"approved":true}
```

The list is READ. Event creation is WRITE and follows configurable write approval.

## Delete an event

Tool: `nylas.event.delete`

```json
{"grant_id":"grant-id","calendar_id":"calendar-id","event_id":"event-id","approved":true}
```

Permission: DESTRUCTIVE. Approval: explicit per call and `NYLAS_ENABLE_DESTRUCTIVE=true`. Destructive operations are disabled by default.

## Verify a webhook notification

Tool: `nylas.webhook.verify`

```json
{"raw_body":"{\"type\":\"message.created\"}","signature":"64-character-hex-signature"}
```

Permission: READ/local validation. Approval: no. Expected output: `{"valid":true}` or `{"valid":false}`. The input must be the exact raw request body received from Nylas.
