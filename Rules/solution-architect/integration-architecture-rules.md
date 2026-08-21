# Integration Architecture Rules

## Purpose
Ensure external and internal integrations are reliable, secure, evolvable, and observable.

## Scope
Covers APIs, messaging, webhooks, file exchange, third-party services, batch transfers, and event streams.

## MUST
- Every integration MUST define contract, ownership, authentication, timeout, retry policy, failure handling, and observability.
- Retryable operations MUST be idempotent or protected against duplicate effects.
- Asynchronous integrations MUST define delivery semantics, ordering assumptions, poison-message handling, and reconciliation strategy where needed.
- External dependencies MUST have bounded timeouts and failure isolation.
- Contract evolution MUST preserve compatibility or use explicit versioning/migration.

## MUST NOT
- MUST NOT use unbounded retries.
- MUST NOT assume exactly-once delivery unless the complete system proves it.
- MUST NOT couple business correctness to undocumented third-party behavior.
- MUST NOT expose internal models directly as public integration contracts without deliberate review.

## SHOULD
- Prefer asynchronous decoupling when latency tolerance and business semantics justify it.
- Provide operational dashboards for business-critical integrations.

## Exceptions
Simple internal integrations may use lighter controls when failure impact is low and ownership is shared.

## Verification
Inspect contracts, integration tests, retry policies, failure simulations, logs, traces, DLQ/reconciliation processes, and dependency SLOs.