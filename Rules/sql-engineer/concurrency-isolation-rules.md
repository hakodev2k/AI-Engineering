# Concurrency and Isolation Rules

## Purpose
Prevent lost updates, inconsistent reads, write skew, deadlocks, and avoidable blocking.

## Scope
Isolation levels, locking, optimistic concurrency, concurrent DML, and high-contention access patterns.

## MUST
- Isolation level MUST be chosen from required consistency semantics, not engine default alone.
- Concurrent write paths MUST define how conflicting updates are detected or serialized.
- Changes to locking or isolation MUST assess anomalies they permit and contention they create.
- Deadlock handling MUST preserve correctness and bounded retry behavior.

## MUST NOT
- MUST NOT use weaker isolation merely to suppress blocking without analyzing resulting anomalies.
- MUST NOT add broad locking hints as a permanent fix without workload evidence.
- MUST NOT assume a query is safe because it succeeds in single-session tests.

## SHOULD
- Prefer short transactions and deterministic resource ordering.
- Use optimistic techniques where conflict rates and semantics make them appropriate.

## Exceptions
Consistency relaxations require explicit business acceptance, documented anomalies, monitoring, and approval.

## Verification
Run concurrent tests that exercise conflicting reads/writes, inspect locks and deadlocks, validate invariants after stress, and review engine-specific isolation semantics.