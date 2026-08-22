# Cross-team Technical Coordination

## Purpose
Coordinate changes across team boundaries while keeping ownership, contracts, sequencing, and risks explicit.

## When to use
Use for shared platforms, cross-service features, migrations, and dependencies spanning multiple teams.

## Inputs
Architecture, team ownership, interfaces, milestones, dependencies, constraints, decision records.

## Context to inspect
Inspect service ownership, roadmaps, interface contracts, release cadence, support responsibilities, and known organizational bottlenecks.

## Core knowledge
Cross-team failures often come from ambiguous ownership and hidden sequencing rather than coding difficulty. Coordination should minimize synchronous dependencies.

## Procedure
1. Define shared outcome and participating owners.
2. Map contracts and dependency edges.
3. Identify decisions requiring joint agreement.
4. Establish a source of truth for interfaces and milestones.
5. Design compatibility so teams can deploy independently where possible.
6. Assign owners and deadlines for blocking decisions.
7. Surface risks early with concrete impact.
8. Use integration checkpoints instead of continuous meetings.
9. Track changes to assumptions.
10. Close temporary coordination mechanisms after delivery.

## Decision points
Create a shared component only when ownership and reuse justify coupling. Prefer stable contracts over synchronized release schedules.

## Common failure patterns
Everyone owns it, meeting-driven coordination, undocumented API assumptions, dependency surprises, and central teams becoming bottlenecks.

## Verification
Ownership is unambiguous, contracts are testable, and each team understands prerequisites and independent delivery boundaries.

## Expected output
A coordination model with owners, contracts, dependency sequence, decisions, and risk tracking.

## Stop conditions
Escalate when priorities conflict materially or no accountable owner exists for a shared dependency.