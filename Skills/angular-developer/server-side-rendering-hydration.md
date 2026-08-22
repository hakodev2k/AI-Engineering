# Server-Side Rendering and Hydration

## Purpose
Design Angular SSR and hydration safely for faster initial rendering, crawlability, and user experience where justified.

## When to use
Use for public content, initial-load optimization, SSR migrations, or hydration defects.

## Inputs
Rendering requirements, hosting architecture, routes, browser-only dependencies, caching strategy, and performance evidence.

## Context to inspect
Inspect server bootstrap, hydration configuration, route behavior, data fetching, DOM access, transfer state, and deployment runtime.

## Core knowledge
Server and browser environments differ. SSR adds operational complexity and does not automatically improve every metric. Hydration requires deterministic compatible markup.

## Procedure
1. Confirm SSR solves a measured product/performance need.
2. Inventory browser-only APIs and third-party libraries.
3. Make rendering paths platform-safe.
4. Avoid duplicate data fetching across server and client where possible.
5. Define cache and personalization boundaries.
6. Validate hydration stability and interactive timing.
7. Handle server rendering failures gracefully.
8. Measure deployed performance and server cost.

## Decision points
Prefer client rendering for authenticated/internal apps when SSR value is low. Cache anonymous pages only when personalization and freshness permit it.

## Common failure patterns
Direct window/document access, hydration mismatch, leaking per-user state across requests, duplicate HTTP calls, and adopting SSR solely for fashion.

## Verification
Test direct navigation, hydration, personalization isolation, browser-only integrations, failure fallback, and web vitals.

## Expected output
A stable SSR/hydration path with measured benefit.

## Stop conditions
Stop when hosting cannot support the required server runtime or caching/security boundaries are unresolved.