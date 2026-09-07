# Bundle Size and Code Splitting

## Purpose
Control JavaScript and CSS delivery so users download, parse, and execute only the code needed for their journey.

## When to use
Use when bundles grow, startup CPU rises, route-specific code ships globally, or dependency changes cause performance regressions.

## Inputs
Bundler stats, source maps, dependency graph, route graph, coverage data, RUM route usage, performance budgets.

## Context to inspect
Identify entry points, shared chunks, duplicate dependencies, side-effect metadata, dynamic-import boundaries, CSS extraction, caching behavior, and framework conventions.

## Core knowledge
Smaller bundles are useful when they reduce critical transfer and execution. Excessive splitting creates request and orchestration overhead. Stable shared chunks improve caching only when their change rate and usage justify them.

## Procedure
1. Establish transfer and uncompressed size baselines by entry/route.
2. Attribute bytes to first-party modules and dependencies.
3. Use runtime coverage to find expensive low-use code.
4. Remove duplicate, obsolete, or accidentally bundled modules.
5. Define split points around meaningful route/feature boundaries.
6. Keep critical interaction code available before it is needed.
7. Verify tree shaking and side-effect declarations.
8. Balance chunk granularity against request and cache overhead.
9. Add size-diff reporting and enforce regression budgets in CI.
10. Validate transfer, parse/execute time, route transitions, and cache reuse.

## Decision points
Split code when deferred probability and cost are material. Keep small frequently co-used modules together. Replace a dependency only when total runtime/maintenance benefit exceeds migration cost.

## Common failure patterns
Optimizing gzip size only; hundreds of tiny chunks; lazy-loading code required for immediate interaction; unstable chunk hashes hurting cache reuse; ignoring duplicated transitive dependencies.

## Verification
Confirm critical bytes and CPU decline on representative routes, deferred chunks load before user-visible need, and repeat navigation benefits from cache reuse.

## Expected output
A bundle composition analysis, deliberate split strategy, and automated size regression guardrails.

## Stop conditions
Escalate when meaningful reduction requires framework, dependency, or product architecture changes beyond scope.