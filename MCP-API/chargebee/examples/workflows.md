# Chargebee connector workflows

## Inspect a customer and subscriptions
1. `chargebee.customer.get` — `{ "customerId": "customer-id" }` — READ — no approval.
2. `chargebee.subscription.list` — `{ "limit": 20 }` — READ — no approval.
Expected output: MCP text containing JSON `{ "source": "untrusted_provider_data", "data": ... }`.

## Safely cancel a subscription
`chargebee.subscription.cancel`
```json
{ "subscriptionId": "subscription-id", "endOfTerm": true, "approvalToken": "<connector-issued-approval>" }
```
Permission: HIGH_RISK. Approval: required. `CHARGEBEE_ALLOW_WRITES=true` must also be configured. Prefer end-of-term cancellation unless the human explicitly approves another supported billing action.

## Update a customer
`chargebee.customer.update`
```json
{ "customerId": "customer-id", "company": "Example Ltd", "approvalToken": "<connector-issued-approval>" }
```
Permission: WRITE. Approval: required.
