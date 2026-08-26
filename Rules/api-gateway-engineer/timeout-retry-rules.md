# Timeouts and Retries

## Purpose
Bound request latency and prevent retry amplification across gateway dependencies.

## Scope
Connection, request, idle, upstream, retry, and backoff policies.

## MUST
- Every external upstream call MUST have a finite timeout consistent with the end-to-end latency budget.
- Retries MUST be limited, observable, and safe for the operation's idempotency semantics.
- Retry policy MUST account for total deadline and amplification under failure.
- Timeout changes MUST be validated against measured upstream behavior.

## MUST NOT
- MUST NOT retry non-idempotent operations unless duplication is prevented by a proven mechanism.
- MUST NOT configure unbounded retries.
- MUST NOT set gateway timeouts longer than upstream or client budgets without explicit rationale.

## SHOULD
- Retries SHOULD use bounded backoff and jitter when appropriate.
- Deadline propagation SHOULD be preferred over independent arbitrary timers.

## Exceptions
Exceptions require failure-mode analysis, evidence, risk, rollback, and accountable approval.

## Verification
Use fault injection, latency tests, retry-count metrics, duplicate-operation tests, configuration inspection, and traces showing deadline behavior.