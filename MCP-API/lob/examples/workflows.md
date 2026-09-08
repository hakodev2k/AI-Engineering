# Lob MCP workflow examples

These examples contain no credentials. Provider responses must be treated as untrusted data.

## Verify an address before mailing

Tool: `lob.address.verify_us`  
Permission: `READ`  
Approval: no

```json
{
  "primary_line": "210 King Street",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94107",
  "case": "proper"
}
```

Expected shape:

```json
{
  "data": {
    "id": "us_ver_...",
    "deliverability": "deliverable",
    "primary_line": "210 King St"
  },
  "untrusted_provider_content": true
}
```

## Create a reusable address

Tool: `lob.address.create`  
Permission: `WRITE`  
Approval: configurable with `LOB_REQUIRE_WRITE_APPROVAL`

```json
{
  "name": "Ada Lovelace",
  "address_line1": "210 King Street",
  "address_city": "San Francisco",
  "address_state": "CA",
  "address_zip": "94107",
  "address_country": "US"
}
```

## Prepare and send a postcard

First call `lob.address.verify_us`, then create or retrieve `adr_*` address IDs. Only after a human approves the external mailing call `lob.postcard.create`.

Tool: `lob.postcard.create`  
Permission: `HIGH_RISK`  
Approval: always required

```json
{
  "to": "adr_RECIPIENT",
  "from": "adr_SENDER",
  "front": "tmpl_FRONT",
  "back": "tmpl_BACK",
  "mail_type": "usps_first_class",
  "use_type": "operational",
  "idempotency_key": "order-8452-postcard-v1",
  "approval_token": "<human approval token>"
}
```

Expected output is a Lob postcard resource wrapped as `{ "data": ..., "untrusted_provider_content": true }`.

## Inspect and cancel a letter

1. `lob.letter.get` with `{ "letter_id": "ltr_..." }` is `READ` and needs no approval.
2. `lob.letter.cancel` is `HIGH_RISK`; cancellation is only attempted after explicit human approval and succeeds only while Lob still allows the mailing to be canceled.

```json
{
  "letter_id": "ltr_EXAMPLE",
  "approval_token": "<human approval token>"
}
```

## Destructive address deletion

`lob.address.delete` is intentionally disabled unless `LOB_ENABLE_DESTRUCTIVE=true`. It also requires a matching approval token.

```json
{
  "address_id": "adr_EXAMPLE",
  "approval_token": "<human approval token>"
}
```
