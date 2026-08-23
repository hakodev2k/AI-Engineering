# Bundle and Build Optimization

## Purpose
Keep frontend build pipelines fast and production bundles efficient through dependency analysis, code splitting, tree shaking, asset strategy, and enforceable budgets.

## When to use
Use when bundles grow, builds slow down, duplicate dependencies appear, or deployment artifacts exceed performance budgets.

## Inputs
Build configuration, dependency graph, bundle analyzer output, CI timings, browser targets, source maps, and deployment constraints.

## Context to inspect
Entry chunks, dynamic imports, dependency duplication, transpilation targets, minification, source maps, asset processing, cache keys, and CI cache behavior.

## Core knowledge
Bundle size is only a proxy; parse/execute cost and request priority also matter. Tree shaking depends on module semantics and package metadata. Build optimizations must preserve debuggability and deterministic artifacts.

## Procedure
1. Record build duration and production artifact baseline.
2. Generate bundle composition evidence.
3. Find oversized, duplicated, or unexpectedly eager dependencies.
4. Confirm browser targets are not causing unnecessary transforms/polyfills.
5. Split code at meaningful route/feature boundaries.
6. Replace or selectively import heavy dependencies where justified.
7. Optimize static asset processing and caching.
8. Configure deterministic CI caches without hiding stale outputs.
9. Add bundle/build budgets for critical regressions.
10. Verify production source maps and error-debugging policy.

## Decision points
Split chunks when deferred code is not needed for initial interaction and chunk overhead is acceptable. Replace dependencies only when measured benefit exceeds migration and maintenance cost.

## Common failure patterns
Micro-chunking, analyzer-driven rewrites without runtime measurement, shipping development code, duplicate framework copies, ineffective tree shaking, and CI caches keyed too broadly.

## Verification
Production build succeeds reproducibly, bundle analysis confirms intended changes, target journeys improve or remain within budgets, and source-map/debugging requirements are satisfied.

## Expected output
A measured build/bundle improvement with budgets and documented trade-offs.

## Stop conditions
Escalate when optimization requires unsupported browser changes, dependency replacement changes public behavior, or artifact/debugging policies are unresolved.