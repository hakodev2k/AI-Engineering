# Data Fetching Rules

## Purpose
Make client-server data access predictable, cancellable where appropriate, and resistant to stale or duplicated state.

## Scope
Applies to HTTP/API requests, query libraries, loaders, mutations, and server-state caching.

## MUST
- Requests MUST define loading, success, empty, and failure behavior where user-visible.
- Request parameters and cache keys MUST represent all inputs that affect the response.
- Mutations MUST define post-success cache/state reconciliation.
- Stale response races MUST be prevented or safely ignored when newer requests supersede older ones.
- Authentication and authorization failures MUST be handled without leaking sensitive details.
- Retry behavior MUST distinguish transient failures from deterministic client/server errors.

## MUST NOT
- MUST NOT retry non-idempotent mutations blindly.
- MUST NOT treat server state as permanently valid client state without freshness rules.
- MUST NOT expose credentials or sensitive tokens through query strings, logs, or client-visible errors.

## SHOULD
- Prefer a consistent server-state abstraction rather than ad-hoc fetching across components.
- Prefer cancellation or supersession for obsolete user-driven requests when supported.

## Exceptions
Document why standard caching/reconciliation is unsuitable, the consistency risk, and verification evidence.

## Verification
Use integration tests, network inspection, race-condition tests, cache-key review, retry tests, and failure-path testing.