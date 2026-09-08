# Novu connector examples

## Inspect delivery state

Tool: `novu.notification.list`

Input:
```json
{"subscriberIds":["user_123"],"limit":25,"channels":["email","in_app"]}
```
Permission: READ. Approval: no.
Expected output shape: `{ "provider":"novu", "untrusted_data":true, "result": ... }`.

## Create a subscriber

Tool: `novu.subscriber.create`

Input:
```json
{"subscriberId":"user_123","email":"user@example.com","firstName":"Ada","approved":true}
```
Permission: WRITE. Approval: explicit human approval when write approval is enabled.

## Trigger a workflow

Tool: `novu.workflow.trigger`

Input:
```json
{"workflowId":"order-confirmation","subscriberId":"user_123","payload":{"orderId":"ORD-42"},"transactionId":"order-42-confirmation","approved":true}
```
Permission: HIGH_RISK because it sends externally visible notifications. Approval: always required under the default policy.

## Cancel a pending event

Tool: `novu.event.cancel`

Input: `{ "transactionId":"order-42-confirmation", "approved":true }`.
Permission: HIGH_RISK. Approval: required.

## Delete a subscriber

Tool: `novu.subscriber.delete`

Input: `{ "subscriberId":"user_123", "approved":true }`.
Permission: DESTRUCTIVE. Approval: required and `NOVU_ENABLE_DESTRUCTIVE=true` must also be configured.
