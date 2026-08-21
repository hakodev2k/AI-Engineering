# Workflow: Deployment Recovery

## Trigger
Failed deployment or degraded service attributable to a release/change.

## Goal
Restore a safe service state quickly while preserving evidence and avoiding uncontrolled retries.

## Stages
1. Declare severity and final incident owner.
2. Freeze conflicting mutations.
3. Capture artifact/config versions and initial telemetry.
4. Parallel read-only investigation: application signals, infrastructure events, dependencies, migration/data, permissions/config.
5. Consolidate facts and classify failure.
6. Choose `rollback`, `roll-forward`, `pause`, or `continue-observation` based on reversibility and risk.
7. Obtain approval if recovery action is destructive/high-risk.
8. Execute one bounded recovery action.
9. Verify user/technical health with fresh telemetry.
10. If not recovered, perform at most one additional evidence-driven branch before escalation unless incident command explicitly authorizes more.
11. Handoff root cause follow-up and prevention actions.

## Stop conditions
Stop automation and escalate for uncertain data corruption, security compromise, repeated failed recovery, missing safe recovery path, or expanding blast radius.

## Definition of Done
Service is stable or explicitly handed to incident command; evidence preserved; recovery verified; follow-up has owners.