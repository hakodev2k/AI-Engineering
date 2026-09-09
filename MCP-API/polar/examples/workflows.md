# Polar connector workflow examples

## Inspect catalog and customer entitlement

1. `polar.product.list`
   - Input: `{ "query": "Pro", "limit": 20 }`
   - Permission: READ
   - Approval: No
2. `polar.customer.list`
   - Input: `{ "email": "customer@example.com" }`
   - Permission: READ
   - Approval: No
3. `polar.customer.state`
   - Input: `{ "external_id": "usr_123" }`
   - Permission: READ
   - Approval: No

Expected output shape for all read tools:

```json
{
  "provider": "polar",
  "untrusted_data": true,
  "result": {}
}
```

## Prepare a checkout

`polar.checkout.create`

```json
{
  "products": ["00000000-0000-4000-8000-000000000001"],
  "external_customer_id": "usr_123",
  "customer_email": "customer@example.com",
  "success_url": "https://example.com/billing/success",
  "approved": true
}
```

Permission: WRITE. Approval: required by default because this creates an externally visible payment flow.

## Issue a refund

`polar.refund.create`

```json
{
  "order_id": "00000000-0000-4000-8000-000000000002",
  "amount": 500,
  "reason": "customer_request",
  "revoke_benefits": false,
  "approved": true
}
```

Permission: HIGH_RISK. Approval: always required by connector policy when approval enforcement is enabled. The connector never retries this write automatically.
