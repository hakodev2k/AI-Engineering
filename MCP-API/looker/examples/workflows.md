# Looker connector examples

## Governed Explore query

Tool: `looker.query.run`

```json
{
  "model": "ecommerce",
  "explore": "orders",
  "fields": ["orders.count", "orders.created_date"],
  "filters": { "orders.created_date": "30 days" },
  "sorts": ["orders.created_date desc"],
  "limit": 100
}
```

Permission: READ. Approval: no. Output: JSON MCP content containing query results.

## Search schedules

Tool: `looker.scheduled_plan.search`

```json
{ "allUsers": false, "limit": 20 }
```

Permission: READ. Approval: no.

## Create delivery schedule

Tool: `looker.scheduled_plan.create`

```json
{
  "name": "Daily revenue",
  "dashboardId": "42",
  "cronTab": "0 8 * * *",
  "destinationType": "email",
  "address": "analytics@example.com",
  "format": "pdf",
  "approvalId": "<HMAC approval token>"
}
```

Permission: HIGH_RISK. Approval: required because the operation creates recurring external data delivery.

## Delete schedule

Tool: `looker.scheduled_plan.delete`

```json
{ "id": "123", "approvalId": "<HMAC approval token>" }
```

Permission: DESTRUCTIVE. Approval: required. The connector does not retry this operation automatically.
