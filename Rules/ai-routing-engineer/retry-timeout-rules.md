# Retry and Timeout Rules

## Purpose
Bound failure amplification and preserve predictable request latency during transient errors.

## Scope
Connection, request, stream, and tool timeouts; retry eligibility; backoff; deadlines; and idempotency.

## MUST
- Every external model/provider call MUST have a finite timeout or inherited request deadline.
- Retries MUST be limited to errors that are safe and reasonably transient.
- Retry budgets MUST account for end-to-end latency and cost constraints.
- Backoff and jitter MUST be used where synchronized retry storms are plausible.
- Request cancellation or deadline expiry MUST propagate to unnecessary downstream work where supported.

## MUST NOT
- MUST NOT retry deterministic validation, authentication, authorization, or policy failures.
- MUST NOT retry indefinitely.
- MUST NOT start a fallback or retry that cannot complete within a mandatory request deadline unless asynchronous semantics explicitly allow it.

## SHOULD
- Distinguish connection establishment, first-byte, stream-idle, and total deadlines where useful.
- Record retry reasons and attempt counts in telemetry.

## Exceptions
Exceptions require a documented failure model, bounded impact, evidence, and approval.

## Verification
Inspect timeout configuration, retry policies, fault-injection tests, traces, and retry-rate dashboards.