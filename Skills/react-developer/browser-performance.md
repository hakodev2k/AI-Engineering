# Browser Performance

## Purpose
Optimize frontend performance beyond React, including network, main-thread, layout, paint, and asset delivery.

## When to use
Use when Core Web Vitals, startup time, scrolling, or interaction responsiveness regress.

## Inputs
Lighthouse/field metrics, network waterfall, performance traces, bundle reports, asset inventory.

## Preconditions
Use realistic throttling and production builds.

## Context to inspect
LCP assets, blocking scripts, hydration, long tasks, layout shifts, fonts, images, third-party scripts.

## Core knowledge
Frontend latency spans network, JavaScript execution, rendering, and asset decoding. Optimize the dominant contributor, not only JavaScript size.

## Procedure
1. Establish field or reproducible lab baseline.
2. Inspect network critical path.
3. Find long main-thread tasks.
4. Check layout shifts and expensive style/layout work.
5. Optimize images/fonts and priority hints.
6. Defer non-critical third-party code.
7. Split or lazy-load heavy routes/features.
8. Re-measure under equivalent conditions.

## Decision points
Prioritize user-visible latency and field data over synthetic scores when they disagree.

## Common failure patterns
Chasing Lighthouse score only, over-splitting bundles, lazy-loading above-the-fold content, ignoring third-party scripts.

## Verification
Compare LCP, INP, CLS, transfer size, and interaction traces before/after.

## Expected output
Evidence-backed browser performance improvements.

## Stop conditions
Stop when CDN/server/network ownership is external and changes require another team.