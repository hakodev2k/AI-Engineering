# Close connector workflow examples

All examples use the connector's stable MCP aliases. Input schemas are imported from the official Close MCP server at runtime; approval fields are connector-local and are removed before forwarding.

## Research an account

1. Tool: `close.lead.search`
   - Input: use the official `lead_search` fields exposed by tool discovery, for example a text query when present.
   - Permission: READ
   - Approval: none
   - Output: official Close MCP result envelope.
2. Tool: `close.lead.get`
   - Input: lead identifier according to the discovered official `fetch_lead` schema.
   - Permission: READ
   - Approval: none

## Create a follow-up task

Tool: `close.task.create`

Input shape: all official `create_task` fields plus connector-local `approved`. Example after a human has approved the write:

```json
{
  "lead_id": "lead_xxx",
  "text": "Follow up after product demo",
  "approved": true
}
```

Permission: WRITE. Approval: configurable; required by default.

Expected output shape: the result returned by Close's official MCP `create_task` tool, serialized as MCP text content by this connector.

## Add a CRM note

Tool: `close.note.create`

```json
{
  "lead_id": "lead_xxx",
  "note": "Customer requested security documentation.",
  "approved": true
}
```

Permission: WRITE. Approval: configurable; required by default. This creates an internal CRM note and does not send an external message.

## Update a lead with explicit approval

Tool: `close.lead.update`

```json
{
  "lead_id": "lead_xxx",
  "name": "Acme Corporation",
  "approved": true,
  "approvalReason": "Sales operations approved the account-name correction"
}
```

Permission: HIGH_RISK. Approval: explicit. Requires `CLOSE_PERMISSIONS=high_risk`, `CLOSE_MCP_SCOPE=mcp.write_destructive`, and `CLOSE_ALLOW_HIGH_RISK=true` in addition to the per-call approval fields.

## Safe operating progression

Use `close.lead.search` / `close.lead.get` to read, prepare a proposed change outside Close, obtain human approval, then call a WRITE or HIGH_RISK tool. The connector intentionally exposes no delete tool and no unrestricted raw HTTP/API tool.
