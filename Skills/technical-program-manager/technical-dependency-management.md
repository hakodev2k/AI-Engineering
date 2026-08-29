# Technical Dependency Management

## Purpose
Identify, model, sequence, and actively manage cross-team technical dependencies so they do not become hidden schedule or integration risks.

## When to use
Use for multi-team programs involving shared platforms, APIs, infrastructure, migrations, security reviews, external vendors, or sequencing constraints.

## Inputs
Workstream plans, architecture diagrams, milestones, interface contracts, ownership map, environment constraints.

## Context to inspect
Existing dependency trackers, service ownership, release calendars, API contracts, platform capacity, security gates, vendor commitments, and known integration bottlenecks.

## Core knowledge
Dependencies vary by type: hard sequencing, interface, environment, organizational, regulatory, capacity, and informational. Senior TPMs distinguish true critical dependencies from coordination noise and drive explicit contracts between owners.

## Procedure
1. Decompose each workstream into deliverables and prerequisites.
2. Identify producer-consumer relationships and shared resources.
3. Classify dependencies by criticality, reversibility, and lead time.
4. Assign one accountable owner on each side.
5. Define required artifact, acceptance criteria, and need-by date.
6. Place critical dependencies on the integrated schedule.
7. Track confidence and evidence, not status labels alone.
8. Escalate dependencies whose slack is consumed.
9. Re-plan sequencing when assumptions change.

## Decision points
Remove dependencies through decoupling when cheaper than coordinating them. Use temporary adapters or parallel paths when they materially reduce critical-path risk.

## Common failure patterns
Tracking dependencies without owners, confusing meetings with mitigation, undocumented interface assumptions, and discovering environment dependencies during integration.

## Verification
Confirm every critical dependency has owners, acceptance evidence, timing, and contingency. Test integration assumptions before the final milestone.

## Expected output
A dependency model that clearly shows critical relationships, readiness evidence, owners, and mitigation actions.

## Stop conditions
Escalate when an external dependency has no enforceable commitment, a required interface remains undefined, or the dependency makes the target date infeasible.