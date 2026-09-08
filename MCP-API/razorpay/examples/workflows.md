# Workflow examples

## Reconcile recent settlements

Tool: `razorpay.settlement.recon`

```json
{ "year": 2026, "month": 9, "count": 100 }
```

Permission: READ. Approval: no. Expected output: Razorpay settlement reconciliation collection with payment/refund/transfer/adjustment rows.

## Inspect an order and its payments

1. `razorpay.order.get`

```json
{ "order_id": "order_example123" }
```

2. `razorpay.order.payments.list`

```json
{ "order_id": "order_example123" }
```

Permission: READ. Approval: no. Expected output: order metadata followed by the payment collection linked to the order.

## Create an order after approval

Tool: `razorpay.order.create`

```json
{
  "amount": 250000,
  "currency": "INR",
  "receipt": "invoice-2026-0091",
  "notes": { "source": "agent-assisted-checkout" },
  "approved": true
}
```

Permission: WRITE. Approval: required by default. Expected output: created Razorpay order. `amount` is in currency subunits.

## Create a customer-facing payment link

Tool: `razorpay.payment_link.create`

```json
{
  "amount": 250000,
  "currency": "INR",
  "description": "Invoice 2026-0091",
  "reference_id": "invoice-2026-0091",
  "customer": { "email": "buyer@example.com" },
  "notify": { "email": false, "sms": false },
  "approved": true
}
```

Permission: HIGH_RISK. Approval: always required because the tool creates a payable external resource. Expected output: created payment-link resource.

## Refund a payment

Tool: `razorpay.refund.create`

```json
{
  "payment_id": "pay_example123",
  "amount": 50000,
  "speed": "normal",
  "receipt": "refund-2026-0007",
  "approved": true
}
```

Permission: HIGH_RISK. Approval: always required. Transport: official REST API because Razorpay's official Remote MCP currently marks `create_refund` as unsupported. Expected output: created refund resource. The connector does not automatically retry this operation.
