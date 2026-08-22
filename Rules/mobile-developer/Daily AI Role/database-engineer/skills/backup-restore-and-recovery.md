# Skill: Backup, Restore, and Recovery

## Purpose
Ensure critical data can be restored to an agreed recovery point within an agreed recovery time.

## Trigger
Recovery review, backup change, restore drill, corruption, data loss, disaster recovery, or failover planning.

## Inputs
RPO/RTO, topology, backup types/schedule/retention, encryption/key dependencies, logs/WAL, replica posture, restore history, data size.

## Procedure
1. Confirm accountable RPO/RTO and data scope; escalate if absent.
2. Map full recovery chain and external dependencies.
3. Verify backup freshness, completeness indicators, retention, access controls, and key availability.
4. Perform restore drill to an isolated target using documented procedure.
5. Verify database opens consistently and application/data invariants on restored copy.
6. Measure restore duration and latest recoverable point.
7. Test point-in-time/failover path where required.
8. Record gaps and remediation owners.

## Constraints
Backup success is not restore proof. Never overwrite the only recoverable copy during a drill.

## Outputs
Recovery evidence, measured RPO/RTO, restore runbook, gaps, owners, escalation.

## Failure handling
Preserve available recovery artifacts. Stop destructive recovery actions when the recovery point or data-loss trade-off is uncertain and request human approval.

## Stop condition
Recovery objectives are met with evidence or gaps are explicitly accepted/escalated.