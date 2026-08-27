# Timeouts Retries and Circuit Breaking

## Purpose
Configure resilience controls without creating retry storms, hidden latency or cascading failure.

## When to use
Use when tuning service calls, responding to dependency instability or defining platform defaults.

## Inputs
End-to-end latency budget, dependency SLOs, idempotency semantics, concurrency, error taxonomy and load profile.

## Context to inspect
Application/client retries, proxy retries, gateway timeouts, queues, connection pools and downstream capacity.

## Core knowledge
Timeouts consume a shared latency budget. Retries multiply load and are safe only for retryable failures and operations with suitable idempotency. Circuit breaking protects capacity; it does not repair dependencies.

## Procedure
1. Derive per-hop budgets from end-to-end SLOs.
2. Inventory retries at every layer.
3. Classify retryable errors and operation idempotency.
4. Select bounded attempts with backoff and jitter.
5. Configure connection/concurrency limits.
6. Define outlier/circuit thresholds from capacity evidence.
7. Test slow, failing and partially failing dependencies.
8. Measure amplification factor and tail latency.
9. Prefer one authoritative retry layer where practical.
10. Document overrides and ownership.

## Decision points
Retry transient failures only when remaining budget permits. Fail fast for overload or non-idempotent ambiguity. Choose circuit thresholds from saturation behavior rather than arbitrary percentages.

## Common failure patterns
Retries at multiple layers, retrying 4xx/business errors, timeouts longer than caller deadlines, synchronized retries, unlimited pending requests and ejection of all healthy capacity.

## Verification
Inject latency/errors, confirm bounded attempts, verify deadline propagation and ensure recovery after dependency restoration.

## Expected output
A resilience policy tied to latency budgets and failure semantics.

## Stop conditions
Escalate when idempotency is unknown, dependency capacity is unmeasured, or changes risk duplicate side effects.