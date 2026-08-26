# Dependency Resilience

## Purpose
Keep payment integrations reliable during latency, rate limiting, and temporary provider failures without duplicating monetary effects.

## When to use
Use for processor APIs, banking integrations, fraud services, queues, and other remote dependencies.

## Inputs
Dependency service levels, idempotency guarantees, latency budgets, error taxonomy, and rate limits.

## Context to inspect
HTTP clients, SDK defaults, retry policies, deadlines, queue redelivery, metrics, and provider documentation.

## Core knowledge
A request timeout can leave the business outcome unknown. Repetition is safe only when operation identity and provider semantics support it. Bounded backoff, jitter, load limits, and temporary request suppression can prevent outage amplification.

## Procedure
1. Classify each operation by replay safety.
2. Define an end-to-end latency budget.
3. Set connection and request deadlines below that budget.
4. Map temporary versus terminal errors.
5. Use bounded exponential backoff with jitter for safe operations.
6. Respect provider rate-limit signals.
7. Preserve stable idempotency keys across attempts.
8. Temporarily suppress calls during sustained provider failure when appropriate.
9. Limit concurrent calls and queue growth.
10. Route ambiguous monetary outcomes to status query or reconciliation.
11. Instrument attempts, final outcomes, latency, and dependency health.
12. Test outage and recovery behavior.

## Decision points
Do not repeat an irreversible command unless the remote system provides reliable idempotency or an authoritative status query that makes recovery safe.

## Common failure patterns
Unbounded attempts, repeating all errors indiscriminately, synchronized backoff, nested retry multiplication, and treating timeout as decline.

## Verification
Inject latency, connection failures, rate limits, server errors, and ambiguous timeouts; prove bounded load and no duplicate monetary effects.

## Expected output
An operation-specific resilience policy with deadlines, safe repetition, load protection, and ambiguous-outcome handling.

## Stop conditions
Escalate if provider guarantees are undocumented for high-value mutations.