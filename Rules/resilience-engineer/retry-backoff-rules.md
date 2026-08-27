# Retry and Backoff Rules

## Purpose
Use retries to recover from transient faults without amplifying outages or duplicating unsafe work.

## Scope
Applies to network calls, database operations, message handling, jobs, and control-plane automation.

## MUST
- Retries MUST be bounded by attempt count, elapsed time, or an end-to-end deadline.
- Retryable errors MUST be explicitly classified; permanent failures MUST fail fast.
- Retried state-changing operations MUST be idempotent or protected by a deduplication or outcome-reconciliation mechanism.
- Backoff MUST increase between attempts for repeated transient failures, and distributed clients MUST use jitter when synchronized retries could occur.
- Retry volume and exhaustion MUST be observable.

## MUST NOT
- MUST NOT retry authentication failures, validation failures, or other known permanent errors merely to improve apparent success rates.
- MUST NOT layer independent retry loops across multiple hops without analyzing worst-case amplification.
- MUST NOT hide persistent dependency failure behind unbounded retries.

## SHOULD
- Retry budgets SHOULD reserve capacity for new work during dependency degradation.
- Servers SHOULD expose retry guidance where protocols support it.

## Exceptions
Immediate retry without backoff is acceptable only for a narrowly defined fault proven to resolve immediately and when amplification risk is bounded and documented.

## Verification
Review retry configuration and error classification, calculate maximum amplification, inject transient and persistent failures, and inspect request rates, latency, duplicate effects, and retry telemetry.