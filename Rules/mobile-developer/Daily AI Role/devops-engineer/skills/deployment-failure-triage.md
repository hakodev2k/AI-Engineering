# Skill: Deployment Failure Triage

## Purpose
Rapidly classify and contain deployment failures without masking them through repeated retries.

## Trigger
Failed deployment, unhealthy rollout, post-deploy regression, stuck rollout, or failed environment promotion.

## Inputs
Deployment logs, artifact identity, diff, environment state, health metrics, error rates, recent changes, infrastructure events, and recovery options.

## Procedure
1. Establish current user/production impact and severity.
2. Freeze unrelated mutations to the affected target when needed.
3. Confirm artifact and configuration actually deployed.
4. Build a timeline from deploy start through symptoms.
5. Classify failure: application, configuration, permission, infrastructure, dependency, migration/data, capacity, non-deterministic, or external service.
6. Run read-only investigation in parallel across logs, metrics, dependency status, and recent changes.
7. Decide rollback, roll-forward, pause, or continue based on safety and reversibility.
8. Apply only the minimal approved recovery action.
9. Verify recovery with fresh telemetry.
10. Record root cause or, if unresolved, bounded next investigation and owner.

## Constraints
MUST NOT repeatedly redeploy unchanged inputs to seek a lucky success. MUST NOT destroy evidence before classification.

## Outputs
Severity, timeline, classification, recovery decision, evidence, residual risk, and follow-up.

## Stop conditions
Escalate immediately when data integrity, security, broad production availability, or irreversible state may be affected.