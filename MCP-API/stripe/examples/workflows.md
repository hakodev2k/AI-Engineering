# Workflow examples

## Inspect a customer and payments
1. `stripe.customer.search` — `{ "query": "email:'buyer@example.com'", "limit": 5 }` — READ — no approval.
2. `stripe.payment_intent.list` — `{ "customer": "cus_...", "limit": 10 }` — READ — no approval.

## Create a customer
`stripe.customer.create` with `email`, `idempotency_key`, and (when configured) an operator-approved `action_id`. Expected output is a Stripe customer object wrapped in `{data, untrusted_provider_content:true}`. Risk: WRITE.

## Refund a payment
`stripe.refund.create` requires `payment_intent_id`, an operator-approved `action_id`, and `idempotency_key`. Optional `amount` is in the currency's smallest unit. Risk: HIGH_RISK; explicit approval always required.

## Publish a payment link
`stripe.payment_link.create` requires an existing Price ID, quantity, approved action ID, and idempotency key. Risk: HIGH_RISK because it creates a public payment surface.
