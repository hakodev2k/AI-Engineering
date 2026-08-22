# Concurrency and Locking Rules
## Purpose
Prevent lost updates, blocking cascades, deadlocks, and inconsistent outcomes.
## Scope
Locks, MVCC, optimistic concurrency, deadlocks, and hot resources.
## MUST
- Identify concurrency semantics for write-heavy or contested workflows.
- Investigate blocking and deadlocks from database evidence before applying broad locking changes.
- Preserve correctness when introducing optimistic concurrency or retry logic.
## MUST NOT
- Use table-wide or pessimistic locking as a default workaround for race conditions.
- Suppress deadlock errors without correcting or safely retrying the affected workflow.
## SHOULD
- Keep lock ordering consistent and critical sections minimal.
## Exceptions
Exceptional locking requires bounded scope, evidence, rollback, and monitoring.
## Verification
Use lock/wait diagnostics, deadlock graphs, concurrency tests, and transaction traces.