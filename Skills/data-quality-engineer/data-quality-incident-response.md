# Data Quality Incident Response

## Purpose
Contain, diagnose, communicate, and recover from production data defects while preserving evidence and preventing unsafe propagation.

## When to use
Use for corrupted, missing, stale, duplicated, semantically wrong, or unexpectedly changed production data affecting consumers.

## Inputs
Incident report, affected datasets, telemetry, lineage, deployments, logs, source data, ownership, and SLOs.

## Preconditions
Establish incident lead and protect source evidence before destructive remediation.

## Context to inspect
Inspect onset time, affected partitions, recent changes, upstream dependencies, downstream consumers, quality alerts, retries, backfills, and publication state.

## Core knowledge
Containment and correctness come before cosmetic dashboard recovery. Data incidents often persist after code is fixed because historical bad data remains published.

## Procedure
1. Confirm symptom and consumer impact.
2. Define affected time range and data scope.
3. Preserve evidence and snapshots where feasible.
4. Stop or quarantine unsafe propagation.
5. Trace lineage to likely fault boundary.
6. Correlate with changes and upstream anomalies.
7. Reproduce defect on controlled data.
8. Fix root cause before broad reprocessing.
9. Define repair/backfill from a stable boundary.
10. Reconcile repaired outputs.
11. Restore publication and monitor.
12. Document timeline, root cause, detection gap, and prevention actions.

## Decision points
Rollback code when it safely restores behavior; backfill when persisted data is wrong. Prefer quarantine over deletion when evidence is needed. Communicate uncertainty explicitly rather than guessing scope.

## Common failure patterns
Restarting jobs repeatedly; deleting bad data before preserving evidence; fixing code but not historical outputs; backfilling from an unsafe checkpoint; declaring recovery from green jobs without reconciliation.

## Verification
Consumer-visible outputs reconcile, SLOs recover, no affected partitions remain unexplained, and prevention actions have owners.

## Expected output
Contained incident, verified repair, impact statement, root cause, evidence, and follow-up controls.

## Stop conditions
Escalate destructive repair, regulated-data impact, uncertain source-of-record, or remediation requiring privileges beyond authorized scope.