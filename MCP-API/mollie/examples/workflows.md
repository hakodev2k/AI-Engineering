# Mollie connector workflows

## Inspect a payment

Tool: `mollie.payment.get`

```json
{ "paymentId": "tr_example" }
```

Permission: `READ`. Approval: no. Expected output: Mollie payment JSON wrapped as untrusted provider data.

## Create a payment link

Tool: `mollie.payment_link.create`

```json
{
  "description": "Invoice 2026-0042",
  "amount": { "currency": "EUR", "value": "49.95" },
  "redirectUrl": "https://merchant.example/thanks",
  "approval": true
}
```

Permission: `WRITE`. Approval: controlled by `MOLLIE_WRITE_POLICY`, default `require`.

## Create a payment

Tool: `mollie.payment.create`

```json
{
  "amount": { "currency": "EUR", "value": "19.99" },
  "description": "Order 1234",
  "redirectUrl": "https://merchant.example/orders/1234",
  "webhookUrl": "https://merchant.example/webhooks/mollie",
  "approval": true
}
```

Permission: `HIGH_RISK`. Approval: always explicit.

## Refund a payment

Tool: `mollie.refund.create`

```json
{
  "paymentId": "tr_example",
  "amount": { "currency": "EUR", "value": "10.00" },
  "description": "Customer support refund",
  "approval": true
}
```

Permission: `HIGH_RISK`. Approval: always explicit. Expected output: Mollie refund object; the connector never retries this write automatically.
