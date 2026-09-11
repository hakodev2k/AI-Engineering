# StatusCake MCP workflow examples

## Investigate an outage

1. `statuscake.uptime.list`
   - Input: `{ "status": "down", "limit": 25 }`
   - Permission: `READ`
   - Approval: none
   - Output: StatusCake uptime-check collection with pagination metadata.
2. `statuscake.uptime.get`
   - Input: `{ "testId": "123" }`
   - Permission: `READ`
   - Approval: none
   - Output: full check configuration and current status.
3. `statuscake.uptime.history`
   - Input: `{ "testId": "123", "limit": 50 }`
   - Permission: `READ`
   - Approval: none
   - Output: recent execution history.
4. `statuscake.uptime.alerts`
   - Input: `{ "testId": "123", "limit": 50 }`
   - Permission: `READ`
   - Approval: none
   - Output: alert history.

## Create a monitor

Tool: `statuscake.uptime.create`

Input:
```json
{
  "name": "Public API",
  "test_type": "HTTP",
  "website_url": "https://api.example.com/health",
  "check_rate": 60,
  "confirmation": 2,
  "tags": ["production", "api"],
  "approved": true
}
```

Permission: `WRITE`. Approval: configurable; required by default. Output shape: `{ "data": { "new_id": "..." } }`.

## Schedule maintenance

Tool: `statuscake.maintenance_window.create`

Input:
```json
{
  "name": "Database maintenance",
  "start_at": "2026-09-12T01:00:00Z",
  "end_at": "2026-09-12T02:00:00Z",
  "timezone": "UTC",
  "repeat_interval": "never",
  "tags": ["production"],
  "approved": true
}
```

Permission: `HIGH_RISK`. Explicit human approval is always required because maintenance windows can suppress alerts.

## Destructive operations

`statuscake.uptime.delete` and `statuscake.maintenance_window.delete` require both `STATUSCAKE_ENABLE_DESTRUCTIVE=true` and `approved: true`. They are never retried automatically.
