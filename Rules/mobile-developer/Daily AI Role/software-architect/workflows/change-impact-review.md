# Workflow: Change Impact Review

## Trigger
A significant API, schema, infrastructure, dependency, data, scaling, security, or topology change is proposed.

## Goal
Determine blast radius, compatibility, migration safety, and approval requirements before implementation/execution.

## Inputs
Proposed change/diff, current architecture, consumers, contracts, migration plan, metrics, risk context.

## Stages
1. Identify reason, urgency, owner, and reversibility.
2. Map affected components, consumers, data, trust boundaries, operations, and dependencies.
3. Check public/internal contract compatibility and versioning.
4. Assess data migration, dual-read/write or coexistence needs, reconciliation, rollback.
5. Review security/reliability/cost-performance only for affected dimensions; parallelize independent reviews.
6. Classify risk: low, medium, high, critical.
7. Define rollout stages, canary/feature flag where appropriate, telemetry, abort thresholds, and rollback.
8. Record ADR when the change alters a durable architecture decision.
9. Obtain required approval for breaking/irreversible/production-sensitive actions.
10. Verify closure of blocker/major findings.

## Checkpoints
No implementation recommendation until affected consumers and rollback feasibility are known for high-risk changes.

## Retry policy
Two review revisions, then escalate disagreement or missing ownership.

## Definition of Done
Blast radius is bounded, compatibility strategy exists, migration/rollback are credible, evidence and approvals match the risk.