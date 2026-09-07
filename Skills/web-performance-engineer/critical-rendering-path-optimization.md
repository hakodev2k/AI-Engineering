# Critical Rendering Path Optimization

## Purpose
Reduce time from navigation to meaningful visible content by optimizing discovery, priority, transfer, parsing, and blocking dependencies.

## When to use
Use when first render or LCP starts late, render-blocking resources dominate startup, or dependency chains delay critical content.

## Inputs
Network waterfall, HTML document, CSS/JS graph, preload/preconnect rules, server timing, LCP attribution.

## Context to inspect
Determine which content is critical above the fold, whether resources are discoverable in initial HTML, dependency depth, cacheability, origin count, and rendering mode.

## Core knowledge
The fastest resource cannot help if discovered late. Critical-path work includes TTFB, HTML streaming, parser blockers, CSS blocking, font behavior, resource hints, and prioritization. Preloading too much competes with truly critical work.

## Procedure
1. Identify the user-visible critical content and its dependencies.
2. Map the dependency chain from document request to render.
3. Measure server response and HTML delivery delays.
4. Find parser-blocking scripts and render-blocking styles.
5. Make the LCP resource discoverable as early as practical.
6. Remove, defer, split, or inline only genuinely critical code.
7. Apply preload/preconnect selectively based on measured need.
8. Reduce origin handshakes and redirect chains.
9. Verify priority ordering in the browser waterfall.
10. Test cold and warm caches on representative networks.

## Decision points
Inline small critical CSS when it improves startup without creating duplication or CSP problems. Preload only resources certain to be consumed soon. Prefer server-side discovery over JavaScript-created critical resources.

## Common failure patterns
Preloading every asset; async-loading essential CSS with flashes; delaying LCP discovery behind client rendering; excessive origins; duplicated CSS; optimizing bytes while dependency ordering remains poor.

## Verification
Confirm earlier discovery/start/render timestamps, improved LCP or first-render metrics, and no cache, CSP, visual, or bandwidth regressions.

## Expected output
A prioritized critical-path dependency map and verified optimization changes.

## Stop conditions
Escalate when backend latency or rendering architecture dominates beyond the frontend optimization boundary.