# Freshservice connector workflows

## Investigate an incident

1. `freshservice.ticket.search`
   - Input: `{ "query": "status:2 priority:4" }`
   - Permission: READ
   - Approval: no
2. `freshservice.ticket.get`
   - Input: `{ "ticketId": 10234 }`
   - Permission: READ
   - Approval: no
3. `freshservice.asset.get`
   - Input: `{ "assetId": 112 }`
   - Permission: READ
   - Approval: no

## Add an internal investigation note

Tool: `freshservice.ticket.note.create`

Input:
```json
{
  "ticketId": 10234,
  "body": "Network team confirmed a transient router reboot.",
  "private": true,
  "approved": true
}
```

Permission: WRITE. `FRESHSERVICE_ALLOW_WRITE=true` and explicit human approval are both required.

## Search self-service content

Tool: `freshservice.solution_article.search`

Input: `{ "query": "VPN connectivity" }`

Expected output: a JSON-encoded MCP result from Freshservice containing matching solution articles and, when applicable, pagination metadata such as a continuation cursor.
