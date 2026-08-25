# Square connector examples

All examples are MCP tool calls. Credentials remain in the connector process and are never tool arguments.

## Inspect recent commerce activity

1. `square.location.list` — input `{}` — READ — no approval.
2. `square.order.search` — input `{"locationIds":["LOCATION_ID"],"limit":25}` — READ — no approval.
3. `square.payment.list` — input `{"locationId":"LOCATION_ID","limit":25,"sortOrder":"DESC"}` — READ — no approval.

Expected output is a JSON-encoded Square API response containing the provider objects plus Square pagination cursors where applicable.

## Find a customer and update their CRM record

1. `square.customer.search` — input `{"query":{"filter":{"email_address":{"exact":"person@example.com"}}},"limit":10}` — READ — no approval.
2. `square.customer.get` — input `{"customerId":"CUSTOMER_ID"}` — READ — no approval.
3. `square.customer.update` — input `{"customerId":"CUSTOMER_ID","note":"Verified contact","approvalId":"<payload-bound HMAC>"}` — WRITE — approval required by default.

## Create an order without charging a payment method

`square.order.create` input:

```json
{
  "order": {
    "location_id": "LOCATION_ID",
    "line_items": [
      { "quantity": "1", "catalog_object_id": "ITEM_VARIATION_ID" }
    ]
  },
  "idempotencyKey": "e7a21483-d930-4c6d-9f35-cc90e92fe6dc",
  "approvalId": "<payload-bound HMAC>"
}
```

Permission: WRITE (`ORDERS_WRITE`). Approval is required by default. This tool creates an order; it does not create a payment or charge a card.

## Refund a payment

`square.refund.create` input:

```json
{
  "paymentId": "PAYMENT_ID",
  "amount": 1500,
  "currency": "USD",
  "reason": "Approved customer refund",
  "idempotencyKey": "eb9f77d4-f381-42c9-a42b-b8bc24f8c906",
  "approvalId": "<payload-bound HMAC>"
}
```

Permission: HIGH_RISK (`PAYMENTS_WRITE`). Approval is always required. `amount` is the smallest currency unit, such as cents for USD.
