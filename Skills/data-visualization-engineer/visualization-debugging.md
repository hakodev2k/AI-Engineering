# Visualization Debugging

## Purpose
Systematically isolate incorrect values, missing marks, broken interactions, layout defects, and rendering inconsistencies.

## When to use
When a visualization disagrees with expected data or behaves differently across states or environments.

## Inputs
Reproduction steps, source data, query output, transformation code, browser traces, screenshots, logs.

## Core knowledge
Visualization defects can arise in source data, joins, semantic calculations, client transformations, scale domains, coordinate systems, layout, rendering, or state management. Debug from data to pixels rather than guessing from appearance.

## Procedure
1. Capture an exact reproducible state including filters and viewport.
2. State expected versus actual behavior.
3. Inspect source query results for the affected marks.
4. Trace records through transformation and aggregation stages.
5. Inspect scale domains, sorting, null handling, and coordinate calculations.
6. Check interaction state and filter propagation.
7. Inspect DOM/canvas/SVG rendering and clipping.
8. Compare environments, browser versions, fonts, and feature flags when relevant.
9. Minimize to the smallest failing dataset.
10. Fix the root cause and add a regression test.

## Decision points
Investigate upstream first when values are wrong; rendering first when data objects are correct but geometry is not. Avoid compensating visually for a semantic data defect.

## Common failure patterns
Fixing symptoms with offsets; debugging only screenshots; stale cached data; hidden filters; scale domains excluding values; unstable sort order.

## Verification
Reproduce the original failure before the fix, demonstrate it no longer occurs, and run adjacent states for regressions.

## Expected output
A root-cause record, corrected implementation, and regression evidence.

## Stop conditions
Escalate when reproduction requires unavailable production data or the defect originates in an upstream system outside authorized scope.