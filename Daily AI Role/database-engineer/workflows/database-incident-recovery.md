# Workflow: Database Incident Recovery

## Trigger
Production database outage, severe degradation, corruption signal, data-loss event, unavailable primary, or dangerous replication state.

## Goal
Protect data first, restore safe service, then produce verified recovery and learning.

## Stages
1. Establish incident owner, severity, affected data/service, timeline, and current topology.
2. Preserve critical evidence and recovery artifacts.
3. Investigator gathers safe diagnostics; Workload Analyst may inspect independent telemetry in parallel.
4. Primary agent selects containment options and states data-loss/reversibility implications.
5. Human approval before forced failover, destructive repair, recovery-point loss, or durability reduction.
6. Execute smallest approved containment/recovery step.
7. Verify database consistency, application health, replication, and data invariants.
8. Hand off stabilized state with remaining risk.
9. After incident: Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.

## Failure handling
No blind retries. If actual recovery state is uncertain, stop and re-read state before any additional write or failover.

## DoD
Service is stable or safely degraded, data-loss status is explicit, recovery evidence exists, ownership is handed off, and follow-up actions have owners.