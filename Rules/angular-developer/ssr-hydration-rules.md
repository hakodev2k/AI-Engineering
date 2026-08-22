# SSR and Hydration Rules

## Purpose
Keep server-rendered Angular applications correct across server, browser, hydration, and caching boundaries.

## Scope
SSR, prerendering, hydration, browser-only APIs, transfer state, caching, and rendering determinism.

## MUST
- Keep server-rendered output deterministic for equivalent request state when hydration depends on it.
- Guard browser-only APIs behind platform-aware boundaries.
- Prevent user-specific or sensitive rendered data from leaking through shared caches.
- Test critical routes with direct navigation, server rendering, hydration, and client navigation.

## MUST NOT
- Access `window`, `document`, storage, or browser-only globals unconditionally in server execution paths.
- Cache personalized SSR output under a shared public cache key.
- Suppress hydration mismatches without identifying their cause.

## SHOULD
- Minimize duplicate server/client data fetching when safe transfer mechanisms are available.

## Exceptions
Client-only rendering for a component is acceptable when SSR incompatibility is justified and its UX/SEO/performance impact is understood.

## Verification
Run SSR builds, direct-request tests, hydration diagnostics, cache isolation tests, and browser/server error monitoring.