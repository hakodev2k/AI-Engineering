# Database Integrity Engineering

## Purpose
Detect, triage, and recover from SQL Server database corruption while preserving evidence and minimizing data loss.

## When to use
Use for CHECKDB failures, 823/824/825 errors, suspect pages, or integrity program design.

## Inputs
DBCC CHECKDB output, SQL error logs, storage telemetry, backup history, RPO/RTO, corruption scope.

## Context to inspect
Inspect affected allocation units/pages, recent hardware/storage events, backup integrity, HA replicas, and prior CHECKDB history.

## Core knowledge
Corruption remediation is primarily a recovery problem. Repair options can lose data; restoring clean data is usually preferable when feasible.

## Procedure
1. Preserve logs and evidence.
2. Determine corruption scope and user impact.
3. Check storage/system health.
4. Identify last known clean backup or replica.
5. Test restore/recovery in isolation.
6. Prefer restore/page restore/failover where appropriate.
7. Use repair only with explicit acceptance of possible data loss.
8. Run CHECKDB after recovery.
9. Validate application-level consistency.
10. investigate root cause.

## Decision points
Choose page restore for isolated eligible damage with suitable backup chains; broader restore/failover for systemic corruption. Never choose REPAIR_ALLOW_DATA_LOSS merely because it is faster.

## Common failure patterns
Running destructive repair first, trusting a replica without checking propagation, deleting evidence, and ignoring underlying storage faults.

## Verification
CHECKDB completes cleanly and application/domain validations pass on recovered data.

## Expected output
Corruption scope, recovery decision, recovered state, data-loss statement, and root-cause follow-up.

## Stop conditions
Stop before destructive repair or production restore without authorized recovery approval.