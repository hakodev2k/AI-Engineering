# SSR and Hydration Rules

## Purpose
Prevent server/client divergence, data leakage, and environment-dependent defects in Vue SSR applications.

## Scope
SSR, hydration, server rendering, universal code, Nuxt-like environments, and client takeover.

## MUST
- Server-rendered output MUST be deterministic for the same request-visible state used during hydration.
- Browser-only APIs MUST be guarded from server execution.
- Per-request state MUST be isolated so one user's data cannot leak into another request.
- Data serialized into HTML MUST be escaped and limited to data safe for client exposure.
- Hydration warnings MUST be investigated rather than routinely suppressed.

## MUST NOT
- Mutable application state MUST NOT be shared across SSR requests unless intentionally process-global and free of user data.
- Rendering MUST NOT depend on nondeterministic client-only values without a hydration-safe strategy.
- Server secrets MUST NOT be serialized into client payloads.

## SHOULD
- Keep universal modules explicit about server/client capabilities.
- Test SSR routes with cold requests and hydration enabled.

## Exceptions
Client-only islands may intentionally defer rendering when SSR provides no useful value; the fallback experience must remain acceptable.

## Verification
Run SSR integration tests, inspect serialized state, test concurrent requests, monitor hydration warnings, and compare server/client markup.