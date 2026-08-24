# Background Work Rules

## Purpose
Ensure deferred work respects Android execution limits, durability needs, battery, and user expectations.

## Scope
Applies to WorkManager, services, jobs, alarms, push-triggered work, and other background execution.

## MUST
- Select the execution mechanism based on durability, immediacy, user visibility, and platform constraints.
- Make retryable durable work idempotent or safely deduplicated.
- Declare network, charging, storage, or timing constraints when correctness or resource use depends on them.
- Persist required inputs/state before claiming work will survive process death.
- Surface terminal failures when user-visible outcomes depend on completion.

## MUST NOT
- Use foreground services to evade background limits without a legitimate user-visible use case.
- Retry failed work indefinitely without backoff, cap, or terminal handling.
- Assume process memory survives until deferred work executes.

## SHOULD
- Batch deferrable work and minimize wakeups.
- Keep workers resumable and independently observable.

## Exceptions
Exact alarms, foreground services, or expedited work require a documented product requirement and platform-policy review.

## Verification
Test process death, constraints, retry behavior, duplicate scheduling, battery-sensitive scenarios, and inspect runtime scheduler state/logs.