# Service Worker and Offline Rules

## Purpose
Control stale asset/data, update, and offline risks introduced by service workers and installable web behavior.

## Scope
Angular service worker, asset groups, data groups, offline fallback, update activation, and cached releases.

## MUST
- Define which resources may be cached, for how long, and what freshness guarantees users require.
- Provide a tested update strategy when a new frontend version is incompatible with cached assets or API contracts.
- Ensure offline mutations have explicit queue, retry, idempotency, and conflict semantics if supported.
- Verify authentication/session changes cannot expose cached protected content to another user.

## MUST NOT
- Cache sensitive authenticated responses by default.
- Force service-worker activation/reload in a way that can silently destroy unsaved user work.
- Assume all clients update immediately after deployment.

## SHOULD
- Communicate update availability when user-controlled reload is safer than immediate activation.

## Exceptions
Immediate activation is acceptable for critical security fixes when data-loss risk is assessed and authorized.

## Verification
Test install/update/offline cycles, stale clients, session changes, cache contents, incompatible releases, and recovery.