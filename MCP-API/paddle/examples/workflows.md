# Paddle connector workflow examples

All IDs and values below are illustrative. No secrets are included.

## Inspect catalog before proposing a change

1. Tool: `paddle.product.list`
   - Input: `{ "perPage": 50, "maxPages": 1, "status": "active" }`
   - Permission: `read`
   - Approval: none
   - Output: `{ data, pages, hasMore, next, requestIds }`
2. Tool: `paddle.price.list`
   - Input: `{ "productId": "pro_...", "perPage": 50, "maxPages": 1 }`
   - Permission: `read`
   - Approval: none

## Create a catalog product and price

1. `paddle.product.create`
   - Input: `{ "name": "Pro", "taxCategory": "standard", "approval": "APPROVE_WRITE" }`
   - Permission: `write`
   - Approval: required when `PADDLE_REQUIRE_WRITE_APPROVAL=true`
2. `paddle.price.create`
   - Input: `{ "productId": "pro_...", "description": "USD monthly", "unitPrice": { "amount": "2500", "currencyCode": "USD" }, "billingCycle": { "interval": "month", "frequency": 1 }, "approval": "APPROVE_WRITE" }`
   - Permission: `write`
   - Approval: required when configured

## Investigate billing before a refund

1. `paddle.transaction.get` reads the transaction.
2. `paddle.adjustment.list` checks previous adjustments.
3. A human reviews the selected transaction items and amount.
4. `paddle.adjustment.create` executes only with `high_risk` permission and `approval=APPROVE_HIGH_RISK`.

## Cancel a subscription

Use `paddle.subscription.get` first. `paddle.subscription.cancel` is `DESTRUCTIVE`, disabled by default, requires connector `destructive` permission, `PADDLE_ENABLE_DESTRUCTIVE=true`, and `approval=APPROVE_DESTRUCTIVE`. Immediate cancellation cannot be reinstated in Paddle.
