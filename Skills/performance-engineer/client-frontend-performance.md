# Client and Frontend Performance

## Purpose
Diagnose user-perceived performance across browser or client startup, rendering, network waterfalls, asset delivery, and main-thread work.

## When to use
Use when backend latency is acceptable but users still experience slow loading, interaction delays, rendering jank, or excessive client resource use.

## Inputs
Real-user metrics, browser/client traces, network waterfalls, bundle/assets, rendering profiles, API timings, device/network segments, and performance targets.

## Context to inspect
Inspect navigation phases, asset sizes, caching/CDN, JavaScript or client CPU, rendering/layout, images/fonts, API waterfalls, hydration, memory, and low-end device behavior.

## Core knowledge
Lab speed and real-user performance differ. Optimize user-centric milestones and interaction latency, not only server response. Device, network, cache state, and geographic distribution strongly affect results.

## Procedure
1. Identify the user journey and user-centric metric that is failing.
2. Segment real-user data by device, network, region, and version.
3. Capture a representative client trace/waterfall.
4. Separate server/network transfer from client processing and rendering.
5. Identify blocking assets, long tasks, repeated renders, or serial API calls.
6. Reduce critical-path bytes and unnecessary work.
7. Apply caching, lazy loading, code splitting, batching, or rendering changes where evidence supports them.
8. Test cold/warm cache and constrained-device scenarios.
9. Compare lab results with real-user telemetry.
10. Check accessibility and correctness after optimization.

## Decision points
Prioritize critical-path work over total bundle size alone. Lazy-load only content that does not harm the required first interaction or user flow.

## Common failure patterns
Testing only powerful developer machines, optimizing synthetic scores without user impact, shifting work after initial load into interaction jank, and ignoring API waterfalls.

## Verification
Target user-centric metrics improve across representative real-user segments without functional regressions.

## Expected output
A client critical-path analysis with measured user-perceived improvement.

## Stop conditions
Stop when the affected client/platform is outside scope and required profiling evidence cannot be obtained.