# Metronome connector examples

Provider responses are always marked as untrusted data by the MCP server.

## Browse customers

Tool: `metronome.customer.list` — `READ`, no approval.

```json
{"limit":25,"ingestAlias":"account-123"}
```

Expected output shape: `{"ok":true,"data":{"data":[...],"next_page":null},"untrustedProviderData":true}`.

## Provision a customer

Tool: `metronome.customer.create` — `WRITE`, approval configurable.

```json
{"name":"Example, Inc.","ingestAliases":["account-123"],"idempotencyKey":"customer-account-123","approvalId":"<host-grant>"}
```

## Ingest billable usage

Tool: `metronome.usage.ingest` — `HIGH_RISK`, explicit approval required because accepted usage can affect balances and invoices.

```json
{"events":[{"transactionId":"event-20260915-0001","customerId":"account-123","eventType":"api_request","timestamp":"2026-09-15T00:00:00Z","properties":{"region":"ap-southeast-1","tokens":1200}}],"approvalId":"<host-grant>"}
```

## Inspect invoices

Tool: `metronome.invoice.list` — `READ`, no approval.

```json
{"customerId":"4db51251-61de-4bfe-b9ce-495e244f3491"}
```

## Create a usage threshold notification

Tool: `metronome.alert.create` — `HIGH_RISK`, explicit approval required.

```json
{"alertType":"usage_threshold_reached","name":"API usage threshold","threshold":100000,"billableMetricId":"58fb0650-e54a-4d17-93cb-ba8e56c32c65","uniquenessKey":"api-usage-100k","approvalId":"<host-grant>"}
```

## Archive a customer

Tool: `metronome.customer.archive` — `DESTRUCTIVE`, disabled by default. It requires both `METRONOME_ENABLE_DESTRUCTIVE=true` and explicit approval. Metronome documents this operation as irreversible and notes that it archives contracts and voids corresponding invoices.
