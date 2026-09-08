# RevenueCat connector workflows

All examples use MCP tool calls against this connector. Provider credentials are configured in the connector process, never in tool inputs.

## Inspect a customer's access

1. `revenuecat.customer.search`

```json
{
  "project_id": "proj1ab2c3d4",
  "search": "user@example.com",
  "limit": 20
}
```

Permission: `READ`. Approval: no.

Expected shape: RevenueCat v2 list object with `items`, pagination metadata, and matching customer records.

2. `revenuecat.customer.subscription.list`

```json
{
  "project_id": "proj1ab2c3d4",
  "customer_id": "customer-id",
  "limit": 20
}
```

Permission: `READ`. Approval: no.

Expected shape: official RevenueCat MCP response containing customer subscriptions; use RevenueCat's `gives_access` field as the authoritative access signal.

## Inspect monetization configuration

Call `revenuecat.product.list`, `revenuecat.entitlement.list`, and `revenuecat.offering.list` with the same `project_id`. These are `READ` operations with no approval requirement and are routed through RevenueCat's official MCP server.

## Grant promotional access

`revenuecat.customer.entitlement.grant`

```json
{
  "project_id": "proj1ab2c3d4",
  "customer_id": "customer-id",
  "entitlement_id": "entl1ab2c3d4",
  "expires_at": 1798761600000,
  "approval_token": "<supplied out-of-band by the human/operator>"
}
```

Permission: `WRITE`. Approval: required. The operation creates promotional access and may create a promotional subscription as a side effect.

## Cancel Web Billing renewal

`revenuecat.subscription.cancel`

```json
{
  "project_id": "proj1ab2c3d4",
  "subscription_id": "sub1ab2c3d4",
  "approval_token": "<supplied out-of-band by the human/operator>"
}
```

Permission: `HIGH_RISK`. Approval: required. Only valid for an active RevenueCat Web Billing subscription. Access continues until the current period ends.

## Refund a Play Store or Galaxy transaction

`revenuecat.subscription.transaction.refund`

```json
{
  "project_id": "proj1ab2c3d4",
  "subscription_id": "sub1ab2c3d4",
  "transaction_id": "GPA.0000-0000-0000-00000",
  "approval_token": "<supplied out-of-band by the human/operator>"
}
```

Permission: `DESTRUCTIVE`. Approval: required. RevenueCat documents this operation as refunding/canceling the transaction and revoking subscription access.
