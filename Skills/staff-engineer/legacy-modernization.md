# Legacy Modernization

## Purpose
Plan and guide modernization of critical legacy systems while preserving business continuity and reducing migration risk.

## When to use
Use when aging architecture, unsupported technology, scaling limits, or delivery friction require structural change. Do not default to rewrites without evidence.

## Inputs
Current architecture, codebase, dependency map, business workflows, incident data, release constraints, target outcomes, migration budget.

## Preconditions
The current system's responsibilities and critical behaviors can be observed or reconstructed.

## Context to inspect
Traffic patterns, data ownership, hidden integrations, batch jobs, operational runbooks, test coverage, deployment process, compliance constraints, and user-visible behavior.

## Core knowledge
Modernization is a risk-management problem. Strangler patterns, compatibility layers, incremental extraction, parallel validation, and reversible cutovers usually outperform big-bang replacement.

## Procedure
1. Define modernization outcomes and non-goals.
2. Map critical workflows and dependencies.
3. Establish behavioral and operational baselines.
4. Identify seams for incremental change.
5. Prioritize high-value, low-coupling migration slices.
6. Design compatibility and data synchronization where required.
7. Add observability and regression protection before cutover.
8. Migrate incrementally with rollback plans.
9. Compare new and old behavior during transition.
10. Retire legacy components only after dependency verification.

## Decision points
Refactor in place when architecture remains viable. Extract components when boundaries are clear. Rewrite only when incremental paths are demonstrably more costly or unsafe.

## Common failure patterns
Big-bang rewrites, undocumented behavior loss, dual-write inconsistency, hidden consumers, no rollback, and declaring success before legacy dependencies are removed.

## Verification
Verify behavior parity, performance, reliability, data integrity, rollback readiness, and removal of obsolete dependencies.

## Expected output
A staged modernization plan with target boundaries, migration slices, risk controls, verification evidence, and retirement criteria.

## Stop conditions
Stop when critical legacy behavior cannot be characterized, data migration safety is unproven, or cutover requires unacceptable downtime without approval.