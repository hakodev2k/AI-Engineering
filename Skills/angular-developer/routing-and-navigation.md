# Routing and Navigation

## Purpose
Design Angular routing that supports clear feature boundaries, deep links, authorization, lazy loading, and predictable navigation.

## When to use
Use for route design, nested navigation, guards, resolvers, or route refactors.

## Inputs
User journeys, URL requirements, permissions, feature boundaries, and SEO/deep-link constraints.

## Context to inspect
Inspect route configuration, lazy imports, guards, resolvers, parameters, query parameters, redirects, and navigation error handling.

## Core knowledge
URLs are public application state. Guards improve UX but do not enforce server authorization. Resolvers can simplify screens but may delay navigation.

## Procedure
1. Map stable user concepts to URL segments.
2. Define route ownership by feature.
3. Lazy-load substantial feature boundaries.
4. Model shareable filters and selections in URL state where appropriate.
5. Add guards for navigation policy and server-side enforcement separately.
6. Use resolvers only when data is required before activation.
7. Define not-found and navigation-failure behavior.
8. Test direct links, refresh, back/forward, and unauthorized access.

## Decision points
Prefer route parameters for resource identity and query parameters for optional view state. Avoid resolvers when progressive loading provides better UX.

## Common failure patterns
Imperative URL construction, authorization only in guards, oversized root route files, lost query state, redirect loops, and eager feature loading.

## Verification
Verify deep links, browser navigation, lazy chunks, permission behavior, and error routes.

## Expected output
Stable navigable URLs and modular route configuration.

## Stop conditions
Stop when URL compatibility or authorization rules are unknown.