# Lifecycle Hooks

## Before task start
**Preconditions:** request exists. **Action:** validate goal, consumer, problem, evidence, deadline, dependencies, and authority. Use `scripts/validate-api-change-request.py` when structured intake is used. **Failure:** block planning for missing critical fields.

## After planning
Check priority, dependencies, parallel review assignments, success metric, checkpoints, and approval gates. Block execution when a critical dependency is unknown.

## Before contract recommendation
Run compatibility, security/governance, consumer DX, and economics/adoption reviews as applicable. Consolidate conflicts explicitly.

## Before launch/deprecation
Require readiness or migration evidence, documentation, owner, monitoring, support path, communication, and approval. Failure blocks completion.

## After delivery
Capture outcome metric, consumer feedback, unresolved risks, follow-up owner, and reusable lesson.

## After failure
Create a failure-learning entry in the decision/handoff record: failure, evidence, root cause, lesson, process change, prevention. Retry transient automation at most twice.