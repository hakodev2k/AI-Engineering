# Workflow examples

## Revenue/support investigation
`lemonsqueezy.order.list` with `{ "store_id": "1", "size": 25 }` is READ and needs no approval. Then call `lemonsqueezy.subscription.get` with the returned subscription ID.

## Customer provisioning
`lemonsqueezy.customer.create` accepts `{ "store_id":"1", "name":"Ada Lovelace", "email":"ada@example.com", "approved":true }`. Risk: WRITE. Expected output is a JSON:API customer object wrapped under `result`.

## Subscription plan change
`lemonsqueezy.subscription.update` accepts `{ "id":"123", "variant_id":456, "disable_prorations":true, "approved":true }`. Risk: HIGH_RISK because it changes billing state.

## Checkout preparation
`lemonsqueezy.checkout.create` accepts `{ "store_id":"1", "variant_id":"42", "email":"buyer@example.com", "preview":true, "approved":true }`. Risk: WRITE. The response contains the checkout object's URL.

## Destructive discount removal
`lemonsqueezy.discount.delete` requires `{ "id":"99", "approved":true }` and `LEMONSQUEEZY_ENABLE_DESTRUCTIVE=true`.
