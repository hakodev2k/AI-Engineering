# Quo MCP tool examples

## Inspect inboxes and conversation history

Tool: `quo.phone_number.list`

```json
{}
```

Permission: READ. Approval: no.

Tool: `quo.conversation.list`

```json
{
  "phoneNumbers": ["PN123abc"],
  "excludeInactive": true,
  "maxResults": 25
}
```

Permission: READ. Approval: no.

## Review calls and AI notes

Tool: `quo.call.list`

```json
{
  "phoneNumberId": "PN123abc",
  "participants": ["+15555550123"],
  "maxResults": 20
}
```

Tool: `quo.call.transcript.get`

```json
{ "callId": "AC3700e624eca547eb9f749a06f2eb1" }
```

Tool: `quo.call.summary.get`

```json
{ "callId": "AC3700e624eca547eb9f749a06f2eb1" }
```

Permission: READ. Approval: no. Transcripts and summaries require the applicable Quo plan and feature availability.

## Create and update a CRM-synced contact

Tool: `quo.contact.create`

```json
{
  "defaultFields": {
    "firstName": "Ada",
    "lastName": "Lovelace",
    "phoneNumbers": [{ "name": "work", "value": "+15555550123" }]
  },
  "source": "custom-crm",
  "externalId": "crm-123",
  "approved": true
}
```

Permission: WRITE. Approval: configurable through connector policy.

Tool: `quo.contact.update`

```json
{
  "id": "66d0d87e8dc1211467372303",
  "defaultFields": { "company": "Analytical Engines Ltd" },
  "approved": true
}
```

Permission: WRITE. Approval: configurable through connector policy.

## Send an SMS

Tool: `quo.message.send`

```json
{
  "from": "PN123abc",
  "to": ["+15555550123"],
  "content": "Your appointment is confirmed for 10:00 AM.",
  "approved": true
}
```

Permission: HIGH_RISK because it sends an external message and may incur API messaging charges. Explicit approval is required, and `QUO_APPROVE_HIGH_RISK=true` must be configured.

## Delete a contact

Tool: `quo.contact.delete`

```json
{
  "id": "66d0d87e8dc1211467372303",
  "approved": true
}
```

Permission: DESTRUCTIVE. Disabled unless `QUO_ENABLE_DESTRUCTIVE=true`; explicit approval is always required.
