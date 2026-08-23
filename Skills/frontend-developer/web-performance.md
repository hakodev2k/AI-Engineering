# Web Performance

## Purpose
Diagnose and improve user-perceived frontend performance using measurements, browser traces, Core Web Vitals, resource analysis, and targeted optimization.

## When to use
Use for slow startup, sluggish interactions, layout shifts, heavy bundles, rendering jank, or performance regressions.

## Inputs
Performance reports, browser traces, field telemetry, bundle output, network waterfall, target devices/networks, and relevant source code.

## Context to inspect
LCP/INP/CLS, long tasks, JavaScript execution, rendering/layout, images/fonts, caching, request waterfalls, hydration/rendering, and third-party scripts.

## Core knowledge
Optimize measured bottlenecks, not intuition. Lab data explains mechanisms while field data shows real-user impact. Network, CPU, rendering, memory, and server latency can each dominate different user segments.

## Procedure
1. Define the affected user journey and performance target.
2. Capture a reproducible baseline under representative constraints.
3. Inspect field metrics when available.
4. Analyze network waterfall and main-thread trace.
5. Identify the largest causal bottleneck.
6. Apply one bounded optimization such as code splitting, image sizing, caching, render reduction, or task decomposition.
7. Re-measure under the same conditions.
8. Check regressions in functionality and accessibility.
9. Add budgets or monitoring for the improved metric.
10. Record before/after evidence and remaining bottlenecks.

## Decision points
Reduce JavaScript when execution is dominant; optimize delivery when network is dominant; reduce rendering/layout work when interaction traces show main-thread rendering cost. Do not lazy-load resources needed immediately for the primary experience.

## Common failure patterns
Optimizing synthetic scores only, shipping excessive JavaScript, layout thrashing, oversized images, unbounded third-party scripts, and claiming improvement without comparable measurements.

## Verification
Before/after traces use comparable conditions, target metrics improve materially, field telemetry is monitored where possible, and no important workflow regresses.

## Expected output
Measured performance improvement with causal evidence, implementation details, and regression guardrails.

## Stop conditions
Stop when measurements are non-reproducible, the bottleneck is outside owned systems, or an optimization would violate correctness/accessibility requirements.