# Data Fetching Rules

## Purpose
Prevent race conditions, duplicate requests, stale UI, and inconsistent server-state handling.

## Scope
HTTP/API calls, query libraries, composables, request lifecycle, retries, pagination, and mutations.

## MUST
- Every request path MUST define loading, success, empty, and failure behavior appropriate to the user flow.
- Concurrent requests for changing inputs MUST prevent stale responses from overwriting newer state.
- Mutations MUST define success confirmation, failure recovery, and cache/state reconciliation.
- Retries MUST be bounded and restricted to operations safe to repeat or protected by idempotency semantics.
- Request cancellation or obsolescence MUST be handled for long-lived views where stale work can affect correctness or resource usage.

## MUST NOT
- Components MUST NOT silently ignore failed mutations.
- Automatic retries MUST NOT repeat non-idempotent operations without a safety mechanism.
- Server state MUST NOT be copied into multiple independent authorities without an invalidation strategy.

## SHOULD
- Centralize cross-cutting request concerns such as auth headers, correlation, and normalized error mapping.
- Use a server-state library when caching/invalidation complexity justifies it.

## Exceptions
Fire-and-forget telemetry may omit user-facing failure handling when loss is acceptable and documented.

## Verification
Use integration tests and network inspection to verify races, retries, cancellation, cache invalidation, and failure states.