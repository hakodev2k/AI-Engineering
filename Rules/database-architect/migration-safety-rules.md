# Migration Safety

## Purpose
Control risk during data and schema migrations.

## Scope
Online migrations, backfills, engine moves, version upgrades, and data transformations.

## MUST
- Migrations MUST define source of truth, checkpoints, validation, rollback or roll-forward strategy, and ownership.
- Large backfills MUST be throttled and observable.
- Data correctness MUST be validated before cutover and after completion.
- Production cutovers, destructive steps, and irreversible transitions MUST require human approval.

## MUST NOT
- MUST NOT combine unrelated risky changes into one migration window.
- MUST NOT assume a migration is safe because it succeeded in a small test environment.
- MUST NOT delete legacy data before acceptance criteria and recovery windows are satisfied.

## SHOULD
- Prefer resumable, idempotent migration steps.
- Prefer dual-read or dual-write only when complexity is justified and reconciliation exists.

## Exceptions
Exceptions require reason, evidence, bounded risk, recovery method, and approval.

## Verification
Use rehearsal runs, row counts, checksums, reconciliation queries, latency monitoring, and rollback drills.