# Offline and Resilience Rules
## Purpose
Prevent misleading or destructive behavior when connectivity is slow, intermittent, or absent.
## Scope
Offline UI, queued actions, service workers, retries, stale data, and reconnect reconciliation.
## MUST
- Connectivity-dependent actions MUST communicate when success is not yet authoritative.
- Queued mutations MUST define deduplication, ordering, expiry, and reconciliation semantics before offline execution is enabled.
- Stale cached data that can affect important decisions MUST communicate freshness when users could reasonably misinterpret it.
- Reconnection MUST reconcile local assumptions with authoritative server state.
## MUST NOT
- Offline UI MUST NOT present a server-side mutation as committed before the contract makes that guarantee.
- Automatic replay MUST NOT repeat destructive or non-idempotent actions without a safe protocol.
## SHOULD
- Degrade to useful read-only behavior when safe and feasible.
## Exceptions
Loss-tolerant interactions may discard unsent state when the UX makes this clear.
## Verification
Network throttling/offline tests, queue replay tests, conflict scenarios, service-worker inspection, and reconnect E2E tests.