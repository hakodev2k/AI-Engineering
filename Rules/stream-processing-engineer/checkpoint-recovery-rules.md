# Checkpoint and Recovery
## Purpose
Ensure deterministic, bounded recovery from failures.
## Scope
Checkpoints, savepoints, snapshots, restore, and restart behavior.
## MUST
- Recovery objectives MUST define acceptable data loss, duplication, and recovery time.
- Checkpoint interval, timeout, retention, and storage durability MUST be justified against workload behavior.
- Production releases affecting state MUST have a tested restore or rollback path.
## MUST NOT
- A successful checkpoint metric MUST NOT be treated as proof of recoverability without restore testing.
## SHOULD
- Recovery drills SHOULD include worker, coordinator, storage, and network failure modes.
## Exceptions
Non-recoverable pipelines require explicit business acceptance and replay capability where feasible.
## Verification
Perform controlled restore tests and compare output/state invariants before and after recovery.