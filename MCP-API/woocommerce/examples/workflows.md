# WooCommerce Connector Examples

## Read products
Tool: `woocommerce.product.list`

Input:
```json
{ "page": 1, "perPage": 20, "status": "publish" }
```

Expected output shape:
```json
{ "data": [{ "id": 123, "name": "Example" }], "source": "untrusted_provider_data" }
```

Permission: `READ`. Approval: not required.

## Create a draft product
Tool: `woocommerce.product.create`

Input:
```json
{
  "name": "New product",
  "type": "simple",
  "status": "draft",
  "regularPrice": "29.00",
  "approvalToken": "<human-approved-token>"
}
```

Expected output shape:
```json
{ "data": { "id": 124, "status": "draft" }, "source": "untrusted_provider_data" }
```

Permission: `WRITE`. Approval: required and `WOOCOMMERCE_ALLOW_WRITES=true`.

## Review and update an order status
First call `woocommerce.order.get` with `{ "orderId": 5001 }`. After a human reviews the concrete order and intended transition, call `woocommerce.order.status.update`:

```json
{ "orderId": 5001, "status": "processing", "approvalToken": "<human-approved-token>" }
```

Expected output shape:
```json
{ "data": { "id": 5001, "status": "processing" }, "source": "untrusted_provider_data" }
```

Permission: `HIGH_RISK`. Approval: always required.

## Add a private operational note
Tool: `woocommerce.order.note.add`

```json
{
  "orderId": 5001,
  "note": "Reviewed by fulfillment automation; manual shipment check requested.",
  "customerNote": false,
  "approvalToken": "<human-approved-token>"
}
```

Permission: `WRITE`. Approval: required. Keep `customerNote=false` unless a separate workflow is explicitly designed and approved for external customer messaging.
