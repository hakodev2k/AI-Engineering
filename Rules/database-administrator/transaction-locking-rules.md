# Transaction and Locking

## Purpose
Control concurrency hazards that can cause blocking, deadlocks, anomalies, or resource exhaustion.

## Scope
Transactions, isolation, locks, deadlocks, long-running sessions, and concurrency configuration.

## MUST
- Isolation choices MUST reflect required consistency semantics and known concurrency cost.
- Long-running transactions and blocking chains MUST be observable and investigated when they threaten service objectives.
- Deadlock analysis MUST identify participating statements and resources before corrective changes are generalized.
- Session termination in production MUST assess rollback cost, business impact, and ownership.

## MUST NOT
- MUST NOT lower isolation or disable locking safeguards merely to hide contention without evaluating correctness impact.
- MUST NOT kill production sessions indiscriminately to clear blocking.
- MUST NOT leave administrative transactions open across unrelated work.

## SHOULD
- Transactions SHOULD be scoped to the smallest business-consistent unit.
- Workloads SHOULD use deterministic access ordering where it materially reduces deadlocks.

## Exceptions
Emergency termination may proceed under incident authority when availability is at risk; affected work and rollback must be monitored.

## Verification
Review transaction age, lock graphs, deadlock reports, isolation settings, rollback duration, application tests, and incident evidence.