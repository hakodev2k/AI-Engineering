# Routing and Navigation

## Purpose
Design stable, deep-linkable, permission-aware navigation and route boundaries.

## When to use
Use for route design, nested layouts, protected areas, data loaders, and navigation bugs.

## Inputs
User journeys, URL requirements, auth state, route framework, SEO needs.

## Preconditions
Know whether rendering is SPA, SSR, SSG, or hybrid.

## Context to inspect
Route tree, loaders/actions, redirects, error boundaries, URL parameters, history behavior.

## Core knowledge
URLs are application state and public contracts. Routes should support refresh/deep links, predictable back/forward behavior, and explicit error/loading states.

## Procedure
1. Map user journeys to stable URLs.
2. Define route/layout boundaries.
3. Keep shareable filters/selections in URL when appropriate.
4. Centralize auth/permission guards at route or server boundaries.
5. Handle 404, unauthorized, and loader failures explicitly.
6. Preserve history semantics.
7. Lazy-load meaningful route chunks.
8. Test direct navigation and refresh.

## Decision points
Use URL state for shareable/bookmarkable state; avoid hiding navigational state exclusively in global stores.

## Common failure patterns
Broken deep links, redirect loops, duplicated auth checks, losing search/filter state, inaccessible focus after navigation.

## Verification
Test direct URLs, refresh, back/forward, unauthorized states, and route error handling.

## Expected output
Predictable navigation and stable route contracts.

## Stop conditions
Stop if server rewrite/hosting behavior required for routes is unknown.