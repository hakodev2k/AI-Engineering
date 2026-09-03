# Retry and Backoff Design

## Purpose
Recover transient event-processing failures without amplifying outages or hiding permanent defects.

## When to use
Use for consumers, producers, broker operations, and external dependencies.

## Inputs
Failure taxonomy, dependency SLOs, timeout budgets, retry limits, message semantics.

## Context to inspect
Existing retry libraries, broker redelivery, application retries, deadlines, rate limits, and dead-letter behavior.

## Core knowledge
Retries consume capacity. Exponential backoff with jitter reduces synchronization. Retry layers multiply attempts unless budgets are coordinated. Permanent validation/business errors should not retry.

## Procedure
1. Classify failures as transient, permanent, unknown, or overload-related.
2. Set operation timeouts before retry policy.
3. Establish a total retry budget.
4. Use bounded exponential backoff with jitter for transient faults.
5. Respect server retry hints and rate limits.
6. Route exhausted/permanent failures for explicit handling.
7. Make operations idempotent.
8. Instrument attempts, exhaustion, delay, and recovery.
9. Test dependency outage and recovery waves.

## Decision points
Retry locally when the dependency is expected to recover inside the processing budget; defer via broker when longer recovery is acceptable; fail fast under overload when retries worsen saturation.

## Common failure patterns
Infinite retries, fixed synchronized intervals, nested retries, retrying authorization/validation failures, missing deadlines, and retry storms.

## Verification
Fault tests show bounded attempt counts, no runaway load, successful transient recovery, and correct terminal routing.

## Expected output
A documented retry policy tied to failure classes and operational budgets.

## Stop conditions
Stop when dependency semantics or safe idempotency are unknown.