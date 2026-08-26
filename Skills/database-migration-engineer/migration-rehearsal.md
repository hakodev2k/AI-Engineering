# Migration Rehearsal

## Purpose
Turn migration assumptions into measured evidence through production-like end-to-end practice.

## When to use
Use before production cutover; repeat after material migration design changes.

## Inputs
Production-scale data copy, migration tooling, runbook, target environment, workload tests, validation suite, rollback plan, and operational team.

## Core knowledge
A useful rehearsal exercises the same sequence, tooling, data scale, permissions, synchronization, validation, and failure handling as production. Happy-path demos are not rehearsals.

## Procedure
1. Define rehearsal objectives and acceptance criteria.
2. Recreate production-representative scale and topology.
3. Execute the exact runbook with named operators.
4. Record timing for every major stage.
5. Exercise synchronization and final reconciliation.
6. Run application smoke and load tests.
7. Inject at least one recoverable failure where safe.
8. Execute rollback or fallback rehearsal.
9. Capture gaps, ambiguities, and manual bottlenecks.
10. Update runbook and rerun material changes.

## Decision points
Use a full-scale rehearsal when timing or capacity is critical; use targeted rehearsals for isolated changes only after end-to-end behavior is already proven.

## Common failure patterns
Using tiny datasets, skipping rollback, allowing undocumented operator improvisation, and not updating timings.

## Verification
All acceptance gates pass within the production window and operators can execute without hidden knowledge.

## Expected output
Measured timings, validated runbook, failure evidence, and resolved rehearsal findings.

## Stop conditions
Do not approve production cutover while critical rehearsal failures remain unresolved.