# Resilience, Timeout, and Retry

## Purpose
Prevent cascading failures across API dependencies.

## Scope
Timeouts, retries, circuit breaking, hedging, backoff, and failure budgets.

## MUST
- Every remote call MUST have a bounded timeout derived from the caller's end-to-end budget.
- Retries MUST be bounded, use backoff, and apply only where retry semantics are safe.
- Retry amplification MUST be considered across dependency layers.
- Failure handling MUST preserve actionable diagnostics.

## MUST NOT
- MUST NOT retry non-idempotent operations unless deduplication or equivalent safety exists.
- MUST NOT configure infinite retries or unbounded waits.

## SHOULD
- Circuit breaking and load shedding SHOULD be used where dependency failure can cascade.

## Exceptions
Exceptions require failure-mode analysis and measured justification.

## Verification
Use fault-injection tests, timeout tests, retry-count telemetry, traces, and configuration review.