# Data Safety Rules
## Purpose
Prevent resilience experiments from causing unacceptable data loss or corruption.
## Scope
Databases, queues, storage, caches, and stateful services.
## MUST
- Assess durability, consistency, backup, replication, and recovery implications before stateful faults.
- Protect irreversible or destructive operations with human approval.
- Verify recovery and data integrity after relevant experiments.
## MUST NOT
- Delete production data merely to simulate failure.
- Assume infrastructure recovery implies data correctness.
## SHOULD
- Prefer reversible network/process faults before destructive state manipulation.
## Exceptions
Destructive recovery drills belong in isolated replicas or explicitly approved controlled environments.
## Verification
Review backups, recovery tests, integrity checks, and experiment audit.