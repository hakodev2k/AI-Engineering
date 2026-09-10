# Squarespace connector workflow examples

These are MCP tool payload examples. Credentials are supplied only to the connector process.

## Inspect a customer order

Tool: `squarespace.order.list`  
Permission: READ  
Approval: no

```json
{
  "fulfillmentStatus": "PENDING",
  "paymentStates": ["PAID", "PARTIALLY_PAID"]
}
```

Expected output shape:

```json
{
  "ok": true,
  "untrustedProviderData": true,
  "data": {
    "result": [],
    "pagination": {}
  }
}
```

Then call `squarespace.order.get` with the selected order ID.

## Inspect and adjust inventory

First call `squarespace.inventory.list` (READ, no approval). For a reviewed stock correction, enable HIGH_RISK operations outside the model and mint an approval token over the exact payload.

Tool: `squarespace.inventory.adjust`  
Permission: HIGH_RISK  
Approval: required

```json
{
  "idempotencyKey": "inventory-correction-20260910-001",
  "incrementOperations": [
    { "variantId": "variant-123", "quantity": 2 }
  ],
  "approvalToken": "<64-character-HMAC>"
}
```

Expected output shape after a successful 204 response:

```json
{
  "ok": true,
  "untrustedProviderData": true,
  "data": { "ok": true }
}
```

## Update a product after review

Tool: `squarespace.product.update`  
Permission: WRITE  
Approval: required by default

```json
{
  "productId": "product-123",
  "name": "Updated product name",
  "isVisible": false,
  "approvalToken": "<64-character-HMAC>"
}
```

## Contact lookup and controlled update

Use `squarespace.contact.query` to locate a contact:

```json
{
  "searchString": "customer@example.com",
  "pageSize": 25
}
```

Then update only reviewed fields with `squarespace.contact.update` (WRITE, approval required by default):

```json
{
  "contactId": "contact-123",
  "primaryEmail": { "acceptsMarketing": false },
  "approvalToken": "<64-character-HMAC>"
}
```

## Fulfill an order

Tool: `squarespace.order.fulfill`  
Permission: HIGH_RISK  
Approval: required

```json
{
  "id": "order-123",
  "shipments": [
    {
      "carrierName": "Example Carrier",
      "service": "Ground",
      "shipDate": "2026-09-10T10:00:00Z",
      "trackingNumber": "TRACK123",
      "trackingUrl": "https://carrier.example/track/TRACK123"
    }
  ],
  "shouldSendNotification": false,
  "approvalToken": "<64-character-HMAC>"
}
```

If `shouldSendNotification` is true, Squarespace can send a customer shipment notification. Review the recipient-impacting action before approval.
