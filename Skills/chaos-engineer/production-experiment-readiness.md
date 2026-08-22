# Production Experiment Readiness

## Purpose
Determine whether a resilience experiment is mature enough for production and establish the controls required to run it responsibly.

## When to use
Use before any production fault injection or live game day.

## Inputs
Experiment plan, lower-environment results, SLOs, business calendar, blast radius, observability, and rollback controls.

## Context to inspect
Inspect current incidents, deployments, staffing, traffic, critical events, data risk, dependencies, and change-management requirements.

## Core knowledge
Production provides realism but increases consequence. Promotion should be evidence-based: lower stages must show the injector, telemetry, abort controls, and recovery work as expected.

## Procedure
1. Confirm the hypothesis requires production realism.
2. Review evidence from safer environments.
3. Revalidate current topology and target selectors.
4. Confirm SLO headroom and absence of active instability.
5. Bound users, duration, and resources.
6. Verify staffed ownership and communication.
7. Test kill controls immediately before execution.
8. Obtain required approval and record the experiment.
9. Execute only inside the approved window.

## Decision points
Do not promote merely because staging passed. Production is warranted when traffic, scale, topology, managed services, or emergent behavior cannot be represented elsewhere.

## Common failure patterns
Treating approval as safety, stale targeting, running during deployments, inadequate staffing, and testing hypotheses already answerable outside production.

## Verification
Use a readiness checklist with explicit evidence for scope, telemetry, abortability, ownership, and recovery.

## Expected output
A documented go/no-go decision with risk controls.

## Stop conditions
No-go for active incidents, missing evidence, weak kill controls, unapproved data risk, or insufficient operational coverage.