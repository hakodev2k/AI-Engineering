# SingleStore MCP tool examples

## List regions
Tool: `singlestore.region.list`
Input: `{}`
Permission: READ
Approval: no
Output: `{ "ok": true, "data": { ... }, "untrusted_provider_content": true }`

## Inspect workspace
Tool: `singlestore.workspace.get`
Input: `{ "workspaceId": "11111111-1111-4111-8111-111111111111" }`
Permission: READ
Approval: no

## Suspend workspace
Tool: `singlestore.workspace.suspend`
Input: `{ "workspaceId": "11111111-1111-4111-8111-111111111111", "approved": true }`
Permission: HIGH_RISK
Approval: explicit human approval plus `SINGLESTORE_APPROVE_HIGH_RISK=true`

## Delete workspace
Tool: `singlestore.workspace.delete`
Input: `{ "workspaceId": "11111111-1111-4111-8111-111111111111", "approved": true }`
Permission: DESTRUCTIVE
Approval: explicit human approval and `SINGLESTORE_ALLOW_DESTRUCTIVE=true`; disabled by default.
