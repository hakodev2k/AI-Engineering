# Payment Availability and Resilience Rules

## Purpose
Keep payment capabilities safe and recoverable during partial failures and dependency outages.

## Scope
Payment APIs, processors, queues, databases, caches, and regional infrastructure.

## MUST
- Critical payment flows MUST define behavior for provider timeout, provider outage, database failure, queue delay, and regional degradation.
- Recovery logic MUST preserve exactly-once financial intent even when execution is retried.
- Circuit breaking or equivalent dependency protection MUST distinguish transient service failure from business decline.
- Failover designs MUST preserve idempotency, ordering assumptions, and authoritative financial state.
- Recovery objectives MUST be documented for critical payment data and processing capabilities.

## MUST NOT
- MUST NOT fail open by bypassing financial validation or authorization controls.
- MUST NOT switch providers automatically when doing so can create duplicate authorization or capture without reconciliation safeguards.
- MUST NOT discard durable payment commands because a downstream dependency is unavailable.

## SHOULD
- Resilience exercises SHOULD test provider outage and partial regional failure.

## Exceptions
Exceptions require documented blast radius, manual fallback, and approval.

## Verification
Run failure injection, failover, restart, replay, and recovery tests; inspect RTO/RPO evidence and duplicate-prevention behavior.