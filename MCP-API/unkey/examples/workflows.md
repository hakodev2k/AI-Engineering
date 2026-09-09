# Unkey MCP workflow examples

All provider responses are returned inside `{ provider: "unkey", untrusted_data: true, result: ... }`.

## Inspect keys

Tool: `unkey.key.list`

Input:
```json
{"api_id":"api_123","limit":25}
```
Permission: `api.api_123.read_key` (or `api.*.read_key`). Approval: no. Expected output: Unkey v2 response envelope containing `data.keys` and pagination metadata when more results exist.

## Issue a credential

Tool: `unkey.key.create`

Input:
```json
{"api_id":"api_123","name":"Partner staging","prefix":"stg","external_id":"partner_42","expires":1798761600000,"approved":true}
```
Permission: `api.api_123.create_key`. Approval: explicit human approval. Expected output: v2 key creation response including the newly issued plaintext key once. Treat that plaintext as a secret and never log it.

## Temporarily disable a key

Tool: `unkey.key.update`

Input:
```json
{"key_id":"key_123","enabled":false,"approved":true}
```
Permission: `api.<apiId>.update_key`. Approval: explicit human approval. Expected output: updated key metadata.

## Enforce a rate limit

Tool: `unkey.ratelimit.limit`

Input:
```json
{"namespace":"ai.generate","identifier":"user_42","limit":100,"duration_ms":60000,"cost":1,"approved":true}
```
Permission: `ratelimit.*.limit`. Approval: required because the check consumes quota. Expected output: `data.success`, `data.limit`, `data.remaining`, and `data.reset`.

## Add a premium override

Tool: `unkey.ratelimit.override.set`

Input:
```json
{"namespace":"ai.generate","identifier":"user_42","limit":1000,"duration_ms":60000,"approved":true}
```
Permission: `ratelimit.*.set_override`. Approval: explicit human approval. Expected output includes the override ID.

## Delete a key

Tool: `unkey.key.delete`

Input:
```json
{"key_id":"key_123","approved":true}
```
Permission: `api.<apiId>.delete_key`. Approval: strong explicit approval and `UNKEY_DESTRUCTIVE_ENABLED=true`. This is permanent revocation.
