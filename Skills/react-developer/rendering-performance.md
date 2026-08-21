# Rendering Performance

## Purpose
Diagnose and improve React rendering performance using evidence instead of blanket memoization.

## When to use
Use for slow interactions, excessive rerenders, large lists, expensive computations, or poor responsiveness.

## Inputs
Profiler traces, component tree, interaction scenarios, bundle/runtime metrics.

## Preconditions
Reproduce the performance issue with representative data and device conditions.

## Context to inspect
React Profiler, browser performance trace, prop identity, context updates, list rendering, expensive selectors.

## Core knowledge
A rerender is not automatically expensive. Optimize committed work, expensive calculations, broad subscriptions, and unnecessary tree updates based on measured cost.

## Procedure
1. Capture baseline interaction timings.
2. Locate expensive commits/components.
3. Identify why they rendered.
4. Narrow state/context subscriptions.
5. Stabilize props only where it prevents costly work.
6. Virtualize large collections when appropriate.
7. Move expensive work off critical paths or precompute.
8. Re-profile after each material change.

## Decision points
Use `memo`, `useMemo`, and `useCallback` only when they reduce measurable work and do not add more complexity than value.

## Common failure patterns
Memoizing everything, optimizing render count instead of latency, ignoring layout/paint cost, unstable keys, rendering huge hidden trees.

## Verification
Compare before/after profiler traces and user-centric latency metrics.

## Expected output
Measured performance improvement with documented bottleneck and trade-off.

## Stop conditions
Stop if the bottleneck is outside React and requires backend/browser/platform work.