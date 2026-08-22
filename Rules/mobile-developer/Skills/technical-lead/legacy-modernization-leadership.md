# Legacy Modernization Leadership

## Purpose
Modernize legacy systems incrementally while preserving business continuity and reducing structural risk.

## When to use
Use when obsolete platforms, coupling, fragile deployments, or poor testability materially constrain delivery or reliability.

## Inputs
Legacy architecture, business workflows, dependencies, incidents, support lifecycle, tests, telemetry, roadmap.

## Context to inspect
Inspect critical behavior, hidden consumers, data ownership, deployment topology, operational knowledge, unsupported components, and change hotspots.

## Core knowledge
Modernization is risk management, not technology replacement. Incremental patterns such as strangler migration, branch by abstraction, compatibility adapters, and expand/contract data changes reduce blast radius.

## Procedure
1. Define modernization outcomes and measurable pain.
2. Map critical workflows and dependencies.
3. Identify high-value seams for extraction or replacement.
4. Establish characterization tests and telemetry.
5. Design coexistence and routing strategy.
6. Migrate one bounded capability at a time.
7. Compare behavior and operational signals.
8. Shift traffic or ownership progressively.
9. Retire old paths only after consumer verification.
10. Remove transitional complexity and update documentation.

## Decision points
Rewrite only when incremental migration cannot economically preserve required behavior. Upgrade in place when architecture is acceptable and lifecycle risk is the primary issue.

## Common failure patterns
Big-bang rewrites, undocumented behavior loss, permanent dual systems, migration without observability, and technology change without business benefit.

## Verification
Migrated workflows meet behavior and SLO expectations, dependencies are removed, and legacy surface measurably shrinks.

## Expected output
A staged modernization path with seams, evidence gates, rollback, and retirement criteria.

## Stop conditions
Escalate when critical behavior cannot be discovered safely or migration requires unacceptable downtime/data risk.