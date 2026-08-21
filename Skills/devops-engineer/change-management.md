# Production Change Management

## Purpose
Reduce risk of infrastructure and platform changes through explicit impact, evidence, rollout, and recovery planning.

## When to use
Use for production changes with non-trivial blast radius, irreversible behavior, or shared-service impact.

## Inputs
Change diff, affected systems, dependencies, maintenance constraints, rollback strategy, validation plan.

## Context to inspect
Recent incidents, current service health, parallel changes, backups, approvals, runbooks, dependency owners.

## Core knowledge
Change safety depends on understanding blast radius, reversibility, observability, sequencing, and concurrent risk. Process should scale with risk rather than becoming ceremony.

## Procedure
1. State goal and expected outcome.
2. Enumerate affected services/users.
3. Classify reversibility and blast radius.
4. Identify dependencies and conflicts.
5. Define pre-change health checks.
6. Define staged execution and hold points.
7. Define objective success/failure criteria.
8. Prepare rollback/roll-forward.
9. Execute with timestamped evidence.
10. Verify and close only after stability window.

## Decision points
Require peer/owner approval when blast radius is shared or recovery is costly; use maintenance window if user impact cannot be avoided; cancel if baseline is already unhealthy.

## Common failure patterns
Vague rollback, multiple risky changes together, no baseline, success declared too early, change during active incident.

## Verification
Pre/post metrics compare cleanly, expected behavior is observed, and recovery path remains viable.

## Expected output
Risk-scaled change plan and evidence of safe completion.

## Stop conditions
Abort when baseline health deteriorates, rollback becomes unavailable, or observed behavior differs materially from plan.