# Source Impact and Performance Rules

## Purpose
Capture changes without destabilizing the transactional source system.

## Scope
Log readers, snapshots, replication slots, CPU, I/O, locks, storage growth, and connection limits.

## MUST
- CDC source overhead MUST be measured under representative workload.
- Snapshot queries MUST be designed to avoid unacceptable locks and resource contention.
- Replication slots or equivalent retention mechanisms MUST be monitored for storage growth.
- Connector concurrency and polling MUST respect source capacity limits.
- Performance changes MUST have before/after evidence.

## MUST NOT
- MUST NOT run unbounded snapshots on production without capacity review.
- MUST NOT increase source polling frequency solely by assumption.
- MUST NOT allow abandoned capture state to retain logs indefinitely.

## SHOULD
- Use read replicas only when their semantics satisfy CDC correctness requirements.
- Define source-protection circuit breakers or operational stop criteria.

## Exceptions
Temporary high-impact operations require human approval, maintenance planning, and active monitoring.

## Verification
Review database metrics, query plans, lock behavior, storage growth, load tests, and connector settings.