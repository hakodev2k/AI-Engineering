# Schema Evolution Rules

## Purpose
Enable continuous evolution without breaking mixed-version readers, writers, or replicas.

## Scope
Schema changes, serialization formats, indexes, constraints, and online migrations.

## MUST
- Schema changes MUST be compatible with the versions that can coexist during deployment.
- Destructive changes MUST use staged expand-migrate-contract or an equivalent verified strategy.
- Backfills MUST be restartable, rate-limited, observable, and safe under concurrent writes.
- Migration completion MUST be verified before old representations are removed.

## MUST NOT
- MUST NOT assume all nodes or clients upgrade atomically.
- MUST NOT perform irreversible destructive migration in production without human approval and tested recovery.
- MUST NOT couple large backfills to latency-sensitive request paths.

## SHOULD
- Changes SHOULD be additive first and contractive only after usage evidence proves safety.

## Exceptions
Emergency changes require explicit risk acceptance, rollback limits, and post-change verification.

## Verification
Review schema diffs, compatibility tests, mixed-version tests, backfill metrics, and rollback rehearsals.