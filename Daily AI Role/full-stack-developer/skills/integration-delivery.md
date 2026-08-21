# Skill: Integration Delivery
Purpose: integrate external/internal services with bounded failure and clear contracts.
Trigger: third-party API, event, queue, webhook, identity, storage, or service-to-service work.
Inputs: provider contract, auth method, limits, retry semantics, SLAs, data sensitivity.
Procedure: define adapter boundary; validate auth/secret handling; set timeouts; classify retryable failures; add bounded retry with jitter where safe; design idempotency/deduplication; handle partial success; normalize errors; add correlation IDs and metrics; provide sandbox/contract tests.
Decisions: never retry permanent validation/auth failures; use circuit/bulkhead controls for high-impact dependencies; queue only when asynchronous semantics are acceptable.
Outputs: integration adapter, tests, operational runbook notes.
Stop: undocumented destructive operation, missing credentials authority, or provider semantics too uncertain for safe automation.