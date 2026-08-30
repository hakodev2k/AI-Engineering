# Lago workflows

- `lago.customer.list` — `{ "page": 1, "per_page": 20 }` — READ — no approval.
- `lago.invoice.list` — `{ "external_customer_id": "cust_123", "payment_status": "failed" }` — READ — no approval.
- `lago.analytics.mrr.get` — `{ "currency": "USD", "months": 12 }` — READ — no approval.
- `lago.event.ingest` — `{ "transaction_id": "evt_001", "external_subscription_id": "sub_001", "code": "api_calls", "properties": { "value": 1 }, "approval_token": "<payload-bound-hmac>" }` — WRITE — approval required.
- `lago.subscription.create` — `{ "external_customer_id": "cust_123", "plan_code": "pro", "external_subscription_id": "sub_001", "approval_token": "<payload-bound-hmac>" }` — HIGH_RISK — approval required.
- `lago.invoice.payment_retry` — `{ "lago_invoice_id": "invoice-id", "approval_token": "<payload-bound-hmac>" }` — HIGH_RISK — approval required.

Successful tool results have `{ "untrusted_provider_data": true, "data": ... }`.
