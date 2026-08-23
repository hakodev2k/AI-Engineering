# Third-Party Integrations

## Purpose
Integrate external APIs and webhooks safely despite latency, outages, rate limits, duplicate delivery, and contract changes.

## When to use
Payments, identity, messaging, SaaS APIs, webhooks, or any externally owned dependency.

## Inputs
Official contract, authentication method, rate limits, SLA, webhook semantics, data sensitivity, business workflow.

## Context to inspect
Existing clients, credential storage, retry policies, timeout budgets, persistence, monitoring, sandbox/test facilities.

## Core knowledge
External dependencies are independent failure domains. Use explicit timeouts, bounded retries, idempotency, validation, version awareness, and isolation from internal domain models.

## Procedure
1. Define required operations and failure impact.
2. Read authoritative API and lifecycle documentation.
3. Create a narrow adapter boundary.
4. Store credentials in approved secret management.
5. Set connect/request timeout budgets.
6. Retry only transient and safe operations with backoff.
7. Respect rate-limit signals.
8. Validate webhook authenticity and deduplicate events.
9. Persist state needed for recovery/reconciliation.
10. Monitor latency, errors, quotas, and contract changes.

## Decision points
Use synchronous calls when the user requires immediate confirmation; asynchronous processing when resilience and decoupling matter more. Retry writes only with proven idempotency.

## Common failure patterns
SDK models leaking through the codebase, retries on all errors, no timeout, secrets in config, trusting webhook payloads, and assuming exactly-once delivery.

## Verification
Test sandbox success, timeout, throttling, invalid credentials, duplicate webhooks, provider outage, and reconciliation.

## Expected output
Resilient integration boundary with operational recovery behavior.

## Stop conditions
Escalate undocumented destructive operations, unclear provider permissions, or unavailable authoritative contracts.