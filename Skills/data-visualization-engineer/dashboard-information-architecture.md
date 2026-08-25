# Dashboard Information Architecture

## Purpose
Structure dashboards so users can detect status, understand causes, and reach actionable detail with minimal cognitive overhead.

## When to use
For recurring operational, analytical, or executive dashboards containing multiple views.

## Inputs
User tasks, KPI hierarchy, dimensions, drill paths, screen constraints, refresh cadence.

## Core knowledge
Dashboard hierarchy should mirror decision hierarchy. Overview, context, diagnosis, and detail should be progressively disclosed. Related controls and views need consistent semantics and predictable interaction.

## Procedure
1. Rank user questions by urgency and frequency.
2. Separate headline status from diagnostic evidence.
3. Define global versus local filters and their scope.
4. Group related metrics and use consistent units and periods.
5. Place high-value status and exceptions before supporting detail.
6. Design drill paths from aggregate to actionable records.
7. Minimize simultaneous views that compete for attention.
8. Define responsive behavior and minimum supported viewport.
9. Add freshness, definitions, and state indicators where needed.
10. Prototype and test task completion before polishing.

## Decision points
Prefer separate pages when audiences, grains, or workflows diverge materially. Use tabs sparingly when hidden comparisons are acceptable; use small multiples when simultaneous comparison matters.

## Common failure patterns
KPI walls; inconsistent filters; hidden filter state; unrelated metrics sharing space; every chart receiving equal emphasis; drill-down without a route back; layout optimized only for author screens.

## Verification
Run representative tasks and measure whether users can locate status, explain a change, and reach detail without verbal guidance.

## Expected output
A dashboard structure specifying hierarchy, regions, navigation, filter scope, drill behavior, and responsive rules.

## Stop conditions
Stop when KPI ownership or intended user workflows remain unresolved enough to make hierarchy arbitrary.