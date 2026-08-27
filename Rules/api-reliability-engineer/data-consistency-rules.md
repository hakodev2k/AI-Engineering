# Data Consistency Rules

## Purpose
Keep API reliability mechanisms from violating data integrity or presenting misleading state.

## Scope
Applies to reads, writes, caches, replicas, distributed workflows, and recovery behavior.

## MUST
- API operations MUST document consistency assumptions when stale, eventual, or partial state can affect consumers.
- Retry, failover, and fallback mechanisms MUST preserve required uniqueness, ordering, and transactional invariants.
- Cache or replica reads MUST have freshness bounds appropriate to the operation.
- Ambiguous write outcomes MUST have a reconciliation or idempotency strategy.
- Recovery procedures MUST verify data correctness, not only service availability.

## MUST NOT
- MUST NOT trade correctness for availability silently when the contract requires strong guarantees.
- MUST NOT acknowledge durable success before required durability conditions are satisfied.
- MUST NOT repair production data destructively without approved, auditable procedures.

## SHOULD
- APIs SHOULD expose version or state information when clients need to reason about concurrency.
- Reconciliation SHOULD be automated where deterministic and safe.

## Exceptions
Exceptions require explicit consistency trade-off, user impact, bounded duration, evidence, recovery plan, and approval.

## Verification
Use concurrency tests, failover tests, invariant checks, reconciliation reports, storage configuration inspection, and production audits.