# Example workflows

## Inspect a customer's billing state

1. `lemon_squeezy.customer.list`

```json
{"email":"person@example.com","page":1,"pageSize":20}
```

Permission: READ. Approval: no.

2. `lemon_squeezy.subscription.list`

```json
{"userEmail":"person@example.com","page":1,"pageSize":20}
```

Permission: READ. Approval: no.

Expected outputs are JSON:API provider responses wrapped in `{ "untrustedProviderData": true, "data": ... }`.

## Create a customer

```text
Tool: lemon_squeezy.customer.create
Permission: WRITE
Approval: required
```

```json
{
  "storeId":"123",
  "name":"Ada Lovelace",
  "email":"ada@example.com",
  "country":"GB",
  "approved":true
}
```

The server must also have `LEMONSQUEEZY_ALLOW_WRITE=true`.

## Change a subscription plan without immediate invoicing

```text
Tool: lemon_squeezy.subscription.update
Permission: HIGH_RISK
Approval: required
```

```json
{
  "id":"456",
  "variantId":789,
  "invoiceImmediately":false,
  "disableProrations":false,
  "approved":true
}
```

The server must also have `LEMONSQUEEZY_ALLOW_HIGH_RISK=true`. Review the current subscription and target variant before executing because plan changes can affect billing and proration.

## Pause collection

```json
{
  "id":"456",
  "pause":{"mode":"void","resumesAt":"2026-10-01T00:00:00Z"},
  "approved":true
}
```

Use `pause: null` to unpause. Both operations use `lemon_squeezy.subscription.update` and are HIGH_RISK.
