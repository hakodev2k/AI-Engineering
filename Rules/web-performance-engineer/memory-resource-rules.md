# Memory and Resource Rules

## Purpose
Prevent memory growth, resource leaks, and browser pressure from degrading responsiveness or causing crashes.

## Scope
Applies to DOM growth, listeners, timers, workers, media, caches, object retention, and long-lived client sessions.

## MUST
- Profile memory behavior for long-lived or resource-intensive journeys where growth can affect users.
- Release timers, subscriptions, observers, event handlers, workers, and large retained objects when their lifecycle ends.
- Bound in-memory caches and define eviction behavior.
- Investigate repeatable memory growth with heap or allocation evidence before remediation.

## MUST NOT
- Treat garbage collection as a substitute for correct resource lifecycle management.
- Keep unbounded DOM nodes, decoded media, or application state solely for convenience.
- Claim a leak is fixed without a repeatable before/after reproduction.

## SHOULD
- Test constrained devices and extended sessions for memory-sensitive applications.
- Prefer lifecycle ownership that makes cleanup explicit and reviewable.

## Exceptions
Exceptions require measured memory cost, product necessity, mitigation, and reassessment criteria.

## Verification
Use heap snapshots, allocation profiles, DOM counters, long-session tests, browser task manager data, and code review.