# Bundle and Loading Performance

## Purpose
Reduce Angular startup and navigation cost through evidence-based bundle, asset, and loading optimization.

## When to use
Use for slow initial load, large JavaScript bundles, poor web vitals, or performance budgets.

## Inputs
Build output, bundle analysis, web-vitals measurements, route structure, assets, and target devices/networks.

## Context to inspect
Inspect route chunks, dependencies, polyfills, fonts, images, scripts, SSR/hydration configuration, and caching headers.

## Core knowledge
Transferred bytes, parse/execute cost, critical rendering resources, and request waterfalls all affect experience. Lazy loading helps only when boundaries match user journeys.

## Procedure
1. Measure baseline on representative devices/network.
2. Analyze bundle composition and route chunks.
3. Remove or replace disproportionately expensive dependencies.
4. Lazy-load noncritical features.
5. Optimize images/fonts and defer noncritical scripts.
6. Evaluate SSR/hydration when initial rendering warrants it.
7. Define enforceable performance budgets.
8. Re-measure cold and warm loads.

## Decision points
Do not split bundles so aggressively that request overhead and duplicated dependencies worsen performance. Adopt SSR only when its operational cost is justified.

## Common failure patterns
Optimizing gzip size alone, loading whole UI libraries, excessive eager routes, oversized images, blocking analytics, and testing only on developer hardware.

## Verification
Compare bundle reports, web vitals, route timings, and real deployment caching behavior.

## Expected output
Smaller or better-scheduled critical resources with measured user impact.

## Stop conditions
Stop when production-like hosting measurements are unavailable and conclusions would be speculative.