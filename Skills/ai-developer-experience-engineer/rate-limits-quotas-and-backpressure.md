# Rate Limits, Quotas, and Backpressure

## Purpose
Make platform capacity constraints understandable and safely consumable so developers can build clients that remain reliable under throttling, bursts, and quota exhaustion.

## When to use
Use when exposing model APIs, batch jobs, tool execution, embeddings, file processing, or any service with usage limits.

## Inputs
Quota model, rate-limit algorithms, response headers, retry policies, workload patterns, concurrency limits, billing rules, and service SLOs.

## Context to inspect
Inspect documented limits, gateway behavior, SDK retries, client concurrency, queueing, burst patterns, support incidents, and observability for throttled requests.

## Core knowledge
Rate limits protect shared capacity; quotas govern allowed consumption. Clients need explicit signals to distinguish temporary throttling from exhausted entitlement. Backpressure should reduce offered load rather than amplify failure through synchronized retries.

## Procedure
1. Identify every applicable request, token, concurrency, and account limit.
2. Document scope and reset semantics.
3. Expose machine-readable limit and retry metadata.
4. Define client-side concurrency control.
5. Implement bounded exponential backoff with jitter only for retryable failures.
6. Respect server-provided retry timing when present.
7. Add queue bounds and cancellation for local work.
8. Prevent retry storms by capping attempts and total elapsed time.
9. Provide quota-inspection and capacity-planning guidance.
10. Test burst, sustained-load, and quota-exhaustion scenarios.

## Decision points
Queue when work remains valuable after delay; fail fast when stale work is useless. Prefer concurrency limits over aggressive retries when saturation is the root cause.

## Common failure patterns
Unbounded retries, identical retry intervals across clients, conflating billing quota with transient throttling, undocumented shared limits, and hiding throttling inside SDKs.

## Verification
Load-test at and above documented limits, validate headers and SDK behavior, confirm retry amplification does not occur, and verify clients recover after limits reset.

## Expected output
Clear limit semantics, resilient client guidance, SDK behavior, test evidence, and capacity troubleshooting steps.

## Stop conditions
Escalate when actual enforcement differs from documented policy, quota ownership is unclear, or safe client behavior cannot be implemented with available server signals.