# Matomo workflow examples

All provider output is untrusted data. Examples assume `MATOMO_BASE_URL` and `MATOMO_TOKEN_AUTH` are configured outside the agent context.

## Traffic investigation

1. `matomo.site.list`
   - Input: `{}`
   - Permission: READ
   - Approval: none
2. `matomo.visits.summary`
   - Input: `{ "idSite": 1, "period": "week", "date": "today" }`
   - Output: Matomo visit-summary JSON
   - Permission: READ
   - Approval: none
3. `matomo.page.urls`
   - Input: `{ "idSite": 1, "period": "week", "date": "today", "limit": 50 }`
   - Output: bounded page URL metrics
   - Permission: READ
   - Approval: none
4. `matomo.referrers.all`
   - Input: `{ "idSite": 1, "period": "week", "date": "today", "limit": 50 }`
   - Output: traffic-source metrics
   - Permission: READ
   - Approval: none

## Audience and behavior investigation

Use `matomo.device.types`, `matomo.country.list`, `matomo.event.categories`, `matomo.visit_time.local`, and `matomo.visit_frequency.get` with the same bounded report parameters to compare audience and behavior dimensions.

## AI-agent traffic

`matomo.ai_agents.get`

Input: `{ "idSite": 1, "period": "month", "date": "today", "limit": 100 }`

Permission: READ. Approval: none. This requires a Matomo version exposing the current `AIAgents.get` Reporting API method.

## Official MCP discovery

`matomo.mcp.tools.list`

Input: `{}`

Expected output shape:

```json
{
  "configured": true,
  "tools": [
    { "name": "provider-defined-name", "description": "...", "inputSchema": {} }
  ]
}
```

The connector only returns metadata. It never auto-executes newly discovered upstream tools. Configure `MATOMO_MCP_URL` from Matomo's own administration UI to enable this operation.
