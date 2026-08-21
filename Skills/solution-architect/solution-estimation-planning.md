# Solution Estimation and Technical Planning

## Purpose
Translate architecture into an executable delivery sequence with explicit dependencies, uncertainty, milestones, and risk-retirement work.

## When to use
Use after architecture direction is sufficiently clear and before committing major delivery timelines.

## Inputs
Architecture, migration steps, dependencies, team capacity, unknowns, testing needs, operational work, external constraints.

## Preconditions
Scope boundaries and major architecture decisions are known.

## Context to inspect
Team ownership, environments, procurement, security reviews, data migration, infrastructure, third parties, release windows, test automation.

## Core knowledge
Architecture estimates should include integration, migration, observability, security, operational readiness, and uncertainty—not only feature coding. Sequence work to retire high-impact uncertainty early.

## Procedure
1. Decompose solution into architecture-relevant workstreams.
2. Identify dependencies and critical path.
3. Separate known implementation work from uncertainty.
4. Schedule spikes only for specific unknowns.
5. Include infrastructure, migration, security, testing, and operational work.
6. Define incremental milestones with verifiable outcomes.
7. Estimate ranges rather than false precision when uncertainty is material.
8. Identify external lead times and approvals.
9. Define architecture checkpoints and decision deadlines.
10. Re-plan as evidence reduces uncertainty.

## Decision points
Prefer thin end-to-end increments over layer-by-layer delivery when feasible. Front-load work that can invalidate the architecture.

## Common failure patterns
Code-only estimates, hidden integration effort, no migration budget, treating unknowns as fixed estimates, delaying operational work until launch.

## Verification
Plan has owners, dependencies, measurable milestones, risk-retirement activities, and visible uncertainty.

## Expected output
Architecture-informed delivery plan and estimation range.

## Stop conditions
Stop when scope or critical external dependencies are too uncertain for credible commitment.