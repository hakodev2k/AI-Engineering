# PayPal connector examples

Provider responses are returned as untrusted data. Examples omit real credentials.

## List invoices — READ

Tool: `paypal.invoice.list`

```json
{
  "page": 1,
  "page_size": 20,
  "status": "SENT"
}
```

Expected output shape:

```json
{
  "source": "paypal-official-mcp",
  "untrusted_provider_data": true,
  "result": {}
}
```

Approval: no.

## Get an order — READ

Tool: `paypal.order.get`

```json
{ "order_id": "5O190127TN364715T" }
```

Approval: no.

## Create an invoice — WRITE

Tool: `paypal.invoice.create`

```json
{
  "recipient_email": "buyer@example.com",
  "items": [
    { "name": "Consulting", "quantity": 2, "unit_price": 150 }
  ]
}
```

By default this returns an approval-required error containing a `target` hash and the allowed expiry window. A human/operator can mint a short-lived approval token outside the model process:

```bash
PAYPAL_APPROVAL_SECRET='use-a-secret-manager-value' \
  npm run approval -- paypal.invoice.create <target-from-error> <expiresAtEpochMs>
```

Then repeat the exact call with:

```json
{
  "recipient_email": "buyer@example.com",
  "items": [
    { "name": "Consulting", "quantity": 2, "unit_price": 150 }
  ],
  "approvalToken": "<operator-generated-token>",
  "approvalExpiresAt": 1787364000000
}
```

Approval: required by default; configurable only for WRITE tools.

## Capture an order — HIGH_RISK

Tool: `paypal.order.capture`

```json
{
  "order_id": "5O190127TN364715T"
}
```

This always requires explicit human approval. Use the returned target hash to mint an approval token, then retry the exact operation:

```json
{
  "order_id": "5O190127TN364715T",
  "approvalToken": "<operator-generated-token>",
  "approvalExpiresAt": 1787364000000
}
```

Approval: always required.

## Partial refund — HIGH_RISK

Tool: `paypal.refund.create`

```json
{
  "capture_id": "8MC585209K746392H",
  "amount": 25,
  "currency": "USD",
  "approvalToken": "<operator-generated-token>",
  "approvalExpiresAt": 1787364000000
}
```

For a full refund, omit both `amount` and `currency`. Approval is always required.

## List disputes — READ

Tool: `paypal.dispute.list`

```json
{ "status": "OPEN" }
```

Approval: no.

## Accept a dispute claim — HIGH_RISK

Tool: `paypal.dispute.accept`

```json
{
  "dispute_id": "PP-R-123456789",
  "approvalToken": "<operator-generated-token>",
  "approvalExpiresAt": 1787364000000
}
```

Approval: always required. This resolves the claim in favor of the buyer and should only be executed after a human has reviewed the dispute.
