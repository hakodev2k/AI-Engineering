# Change Detection Performance

## Purpose
Diagnose and reduce unnecessary Angular rendering work without premature optimization.

## When to use
Use for sluggish interactions, expensive lists, frequent updates, or measured rendering regressions.

## Inputs
Performance trace, component tree, templates, state flows, and reproducible scenario.

## Context to inspect
Inspect template expressions, signal reads, component boundaries, list tracking, event frequency, DOM size, and third-party widgets.

## Core knowledge
Optimize measured bottlenecks. Stable identity, limited DOM work, localized reactive dependencies, and avoiding repeated expensive template computation usually matter more than micro-optimizations.

## Procedure
1. Reproduce and record a baseline.
2. Separate rendering cost from network and JavaScript work.
3. Identify components and expressions updated most often.
4. Remove expensive template computations.
5. Ensure lists use stable identity.
6. Localize state reads and component updates.
7. Virtualize or paginate large DOM collections when needed.
8. Measure again under equivalent conditions.

## Decision points
Prefer structural fixes over memoization tricks. Virtualize when DOM volume is the bottleneck; paginate when product and data constraints support it.

## Common failure patterns
Optimizing without profiling, unstable tracking keys, giant component trees, mutable shared objects causing broad invalidation, and blaming change detection for network latency.

## Verification
Compare traces and user-centric metrics before/after; confirm behavior and tests remain correct.

## Expected output
Measured rendering improvement with evidence and no functional regression.

## Stop conditions
Stop when the issue cannot be reproduced or profiling evidence points outside Angular rendering.