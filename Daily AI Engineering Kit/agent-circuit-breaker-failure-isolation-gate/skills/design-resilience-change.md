# Design Resilience Change

## Purpose
Implement the smallest testable change that prevents a dependency failure from cascading.

## Inputs
Investigation findings, dependency semantics, latency/error evidence, existing tests and acceptance criteria.

## Required context
Call path, idempotency semantics, retryable status/error set, timeout budget, concurrency model, fallback safety, observability.

## Process
1. Define the failure boundary and the behavior while healthy, degraded, open and half-open.
2. Bound each attempt with timeout/cancellation.
3. Retry only explicitly transient/idempotent operations; cap attempts and add backoff/jitter where appropriate.
4. Place the circuit breaker outside the individual retry attempt so repeated failed executions contribute to opening the circuit.
5. Define a small half-open probe allowance and deterministic transition criteria.
6. Choose safe fallback or fail-fast behavior; never fabricate successful business results.
7. Emit structured telemetry for state transitions, rejected calls, latency and failure class without secrets.
8. Add tests for success, transient recovery, terminal failure, open-state rejection, half-open recovery and cancellation.
9. Run scanner/tests and inspect the diff for unrelated changes.

## Verification
A forced dependency failure cannot create unbounded retries; open state rejects quickly; recovery requires successful probe evidence; terminal failures are not retried.

## Failure handling
Implementation/test loop is bounded to two retries for tool/transient failures. Repeated test failures stop with preserved output.

## Stop conditions
Stop for production configuration/deployment, breaking contracts, security weakening, infrastructure changes, or changes whose idempotency cannot be established.
