# Retry and Backoff Rules

## Purpose
Prevent retries from amplifying failures, overloading dependencies, or creating uncontrolled duplicate work.

## Scope
Producer retries, consumer retries, client reconnects, and dependency retry policies.

## MUST
- Retryable and non-retryable failure classes MUST be defined.
- Retries MUST be bounded by count, time, or both.
- Backoff MUST increase delay for repeated transient failures and SHOULD include jitter in distributed clients.
- Retry policies MUST account for message expiration, ordering, and idempotency.

## MUST NOT
- MUST NOT retry permanent validation or authorization failures as transient errors.
- MUST NOT use tight retry loops during broker or dependency outages.
- MUST NOT stack multiple retry layers without understanding the resulting worst-case amplification.

## SHOULD
- Centralize retry policy where it improves consistency and observability.

## Exceptions
Aggressive retry requires measured recovery benefit, bounded blast radius, and review.

## Verification
Inspect retry configuration, timing tests, failure-injection results, duplicate metrics, and dependency load.