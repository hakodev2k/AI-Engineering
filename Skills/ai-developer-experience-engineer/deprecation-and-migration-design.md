# Deprecation and Migration Design

## Purpose
Move developers from obsolete AI APIs, models, SDK surfaces, or behaviors to supported alternatives without surprise outages or unnecessary rewrites.

## When to use
Use before retiring models, endpoints, parameters, SDK methods, auth flows, package versions, or behavioral contracts.

## Inputs
Current and replacement behavior, usage telemetry, affected clients, compatibility policy, support windows, release channels, migration complexity, and business deadlines.

## Context to inspect
Inspect production usage, dependency graphs, SDK versions, model identifiers, documentation, examples, error telemetry, customer commitments, and prior deprecation incidents.

## Core knowledge
Deprecation is a product and operational process, not only a warning message. Senior DX work minimizes involuntary breakage by detecting affected usage, providing equivalent replacement patterns, sequencing warnings, and validating migration at scale.

## Procedure
1. Define exactly what behavior is deprecated and why.
2. Identify replacement behavior and material differences.
3. Measure affected usage by version, account, language, and workload where permitted.
4. Define announcement, warning, freeze, and removal milestones.
5. Provide before/after examples and automated migration aids when feasible.
6. Add runtime or compile-time warnings with actionable destinations.
7. Update docs, samples, SDKs, and templates to stop creating new legacy usage.
8. Test replacement behavior against representative workloads.
9. Track migration progress and unresolved blockers.
10. Increase warning visibility as removal approaches.
11. Validate rollback or extension criteria for critical blockers.
12. Remove behavior only after approval and final verification.

## Decision points
Use compatibility shims when migration is mechanical and low-risk. Prefer explicit breaking versions when old and new semantics cannot safely coexist. Extend timelines when critical workloads lack a viable replacement, not merely because migration progress is inconvenient.

## Common failure patterns
Announcing without telemetry, replacement APIs missing required capabilities, samples still teaching deprecated behavior, ambiguous dates, silent aliases that mask future breakage, and removing before support tooling is ready.

## Verification
Run migration tests, confirm warnings reach affected developers, compare replacement outcomes, verify updated documentation and packages, and monitor residual legacy traffic before removal.

## Expected output
A migration plan with scope, milestones, compatibility notes, tooling, examples, telemetry, and removal criteria.

## Stop conditions
Stop when no functionally acceptable replacement exists, contractual commitments conflict with removal, migration telemetry is insufficient for risk assessment, or critical workloads cannot be validated.