# Locking and Concurrency Rules
## Purpose
Prevent correctness defects and avoidable production stalls.
## Scope
Row, table, advisory, predicate locks, deadlocks, and concurrent DDL.
## MUST
- Identify lock modes and acquisition order for high-contention or schema-changing operations.
- Set bounded lock waits for operational changes where indefinite blocking is unsafe.
- Investigate deadlocks from server evidence rather than suppressing symptoms.
## MUST NOT
- Execute known blocking DDL on busy production tables without impact analysis and approval.
- Use advisory locks without stable ownership and release semantics.
## SHOULD
- Acquire shared resources in a consistent order.
## Exceptions
Emergency blocking actions require incident authority and explicit blast-radius control.
## Verification
Inspect pg_locks, blocked sessions, deadlock logs, transaction age, and concurrency tests.