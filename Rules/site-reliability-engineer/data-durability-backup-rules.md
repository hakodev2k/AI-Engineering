# Data Durability and Backup Rules

## Purpose
Protect critical data against corruption, accidental deletion, infrastructure failure, and unrecoverable operational mistakes.

## Scope
Applies to databases, object stores, queues with durable expectations, backup systems, snapshots, and restore procedures.

## MUST
- Critical data MUST define durability expectations, retention, recovery point objective, and recovery time objective.
- Backups MUST be monitored for successful completion and periodically tested through restore exercises.
- Restore procedures MUST document required dependencies, credentials, ordering, and validation.
- Destructive data operations MUST require explicit human approval and a recovery strategy where feasible.
- Replication MUST NOT be treated as a backup unless it independently satisfies deletion and corruption recovery needs.

## MUST NOT
- MUST NOT claim data is protected merely because snapshots or replicas exist.
- MUST NOT retain backups indefinitely without considering security, privacy, and lifecycle requirements.
- MUST NOT execute destructive maintenance without confirming scope and target environment.

## SHOULD
- Prefer immutable or protected backup copies for high-value data.
- Test restores under realistic recovery constraints.

## Exceptions
Reduced retention or recovery objectives require documented business impact, evidence, owner approval, and compensating controls.

## Verification
Review backup job history, restore-test evidence, retention policies, RPO/RTO documentation, access controls, and recovery runbooks.