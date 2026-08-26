# Migration Automation and Idempotency

## Purpose
Engineer migration tooling that can be repeated, resumed, audited, and safely operated under partial failure.

## When to use
Use for schema conversion, data transfer, validation, synchronization, and operational runbook automation.

## Inputs
Migration stages, source/target APIs, checkpoints, retry policy, credentials model, logs, and failure scenarios.

## Core knowledge
Migration automation must assume partial execution. Idempotency requires stable operation identity, explicit state, deterministic transformations, bounded retries, and safe restart boundaries.

## Procedure
1. Break migration into independently verifiable stages.
2. Give each stage explicit inputs, outputs, and checkpoints.
3. Make transformations deterministic.
4. Use stable keys for chunk and operation identity.
5. Ensure rerunning a completed operation does not duplicate or corrupt data.
6. Persist checkpoints outside ephemeral process memory.
7. Classify errors as retryable, terminal, or requiring operator decision.
8. Bound retries with backoff and observability.
9. Emit structured audit logs without secrets.
10. Test interruption and restart at multiple failure points.
11. Version migration code and configuration.

## Decision points
Automate repetitive deterministic steps; retain human gates for irreversible actions and ambiguous correctness decisions.

## Common failure patterns
Blind retries, local-only checkpoints, nondeterministic timestamps, duplicate inserts, hidden manual fixes, and credentials in scripts.

## Verification
Kill and restart the migration at controlled points and prove final data is identical to uninterrupted execution.

## Expected output
Resumable, auditable migration tooling with explicit operator gates.

## Stop conditions
Stop automated retries when error classification is unknown, state is ambiguous, or continued execution could amplify corruption.