# SSR and Hydration

## Purpose
Build Vue SSR applications that render consistently across server and browser while avoiding hydration, isolation, and browser-API defects.

## When to use
Use with SSR frameworks/custom SSR, hydration warnings, SEO/server-render requirements, or request-state leaks.

## Inputs
SSR architecture, render code, data-loading strategy, routes, and hydration symptoms.

## Context to inspect
Inspect server entry, client entry, per-request app/store creation, browser-only APIs, async data, generated markup, and caching.

## Core knowledge
Server and client initial render must agree. Shared module state can leak across requests. Browser globals are unavailable during server rendering. Time/randomness/environment-dependent rendering can cause mismatches.

## Procedure
1. Map server render and client hydration lifecycle.
2. Ensure app, router, and state are isolated per request.
3. Identify browser-only dependencies and guard/defer them.
4. Make initial data deterministic and serialized safely.
5. Remove nondeterministic render output.
6. Validate HTML semantics that browsers may normalize differently.
7. Reproduce hydration warnings with production build.
8. Test concurrent SSR requests for state leakage.
9. Measure server latency and hydration cost.

## Decision points
Use client-only rendering for components that fundamentally require browser APIs and provide suitable fallback. Cache SSR output only when personalization and invalidation are safely handled.

## Common failure patterns
Singleton stores on server, accessing window during SSR, timezone mismatch, random IDs, unsafe state serialization, and hiding hydration warnings instead of fixing divergence.

## Verification
No hydration warnings, concurrent requests remain isolated, initial state matches, and production SSR/client navigation both work.

## Expected output
Deterministic SSR with safe request isolation and hydration.

## Stop conditions
Stop when framework-specific SSR lifecycle or caching ownership cannot be established.