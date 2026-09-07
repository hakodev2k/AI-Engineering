# SPA Navigation Performance

## Purpose
Optimize client-side route transitions so single-page applications remain fast after initial load, not only on hard navigation.

## When to use
Use when route transitions stall, data fetching blocks UI, code chunks arrive late, or long-lived sessions degrade over time.

## Inputs
Route graph, navigation traces, data-fetch timings, bundle chunks, state-management behavior, RUM soft-navigation telemetry.

## Context to inspect
Inspect router lifecycle, loaders, request waterfalls, prefetch rules, shared state, cache invalidation, transition UI, chunk boundaries, and instrumentation for soft navigations.

## Core knowledge
SPA latency often combines code loading, data dependencies, render CPU, and state invalidation. Prefetching trades bandwidth for latency and must reflect navigation probability. A fast initial page can hide poor in-session performance.

## Procedure
1. Instrument route-transition start, meaningful render, and interaction readiness.
2. Rank slow transitions by traffic and business importance.
3. Trace code, data, rendering, and state-update work separately.
4. Eliminate serial request waterfalls when dependencies permit concurrency.
5. Align code-splitting boundaries with route behavior.
6. Prefetch high-probability next resources under suitable network conditions.
7. Preserve reusable cached data with explicit freshness semantics.
8. Reduce broad state subscriptions and unnecessary rerenders.
9. Provide immediate transition feedback without masking actual latency.
10. Test repeated navigation, back/forward behavior, offline/poor network, and long sessions.

## Decision points
Prefetch only when expected latency benefit exceeds bandwidth and server cost. Reuse cached data when staleness is acceptable; otherwise revalidate in background or block explicitly. Favor concurrent fetching unless one request truly depends on another.

## Common failure patterns
Measuring only hard loads; aggressive prefetching on constrained networks; route changes triggering global rerenders; sequential loaders; stale caches without invalidation; missing soft-navigation RUM.

## Verification
Confirm improved transition distributions, lower request/render critical path, correct data freshness, and stable memory during long sessions.

## Expected output
A route-transition performance map, prioritized fixes, and production soft-navigation metrics.

## Stop conditions
Escalate when improvements require major routing/state architecture changes or backend APIs enforce unavoidable serial dependencies.