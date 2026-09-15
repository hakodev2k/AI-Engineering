# Personio MCP workflow examples

## Inspect workforce
Tool: `personio.employee.list`
Input: `{ "limit": 50, "offset": 0 }`
Permission: READ. Approval: no.
Expected shape: Personio employee collection; fields are limited to attributes whitelisted for the custom integration.

## Inspect time off
Tool: `personio.time_off.list`
Input: `{ "start_date": "2026-09-01", "end_date": "2026-09-30", "limit": 100, "offset": 0 }`
Permission: READ. Approval: no.

## Prepare then create time off
First inspect the employee and existing periods. After a human explicitly approves execution, call `personio.time_off.create` with `approved: true`. The connector must also have `PERSONIO_APPROVE_WRITES=true`. Keep `skip_approval: false` to preserve Personio's configured approval flow.

## Event-driven synchronization
Use `personio.webhook.list` and `personio.webhook.get` to inspect configured Personio v2 webhook subscriptions. Webhook creation/update/deletion are intentionally not exposed by this connector because changing event destinations is a security-sensitive configuration action.
