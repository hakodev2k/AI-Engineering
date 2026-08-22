# Offline-First Rules
## Purpose
Keep supported user workflows predictable under absent, slow, or intermittent connectivity.
## Scope
Offline behavior, local persistence, queued operations, synchronization, and connectivity transitions.
## MUST
- Every network-dependent critical workflow MUST define behavior for unavailable and interrupted connectivity.
- Locally accepted mutations MUST record enough durable information to retry or reconcile safely.
- UI MUST distinguish confirmed server state from pending or stale local state when the distinction matters.
## MUST NOT
- Connectivity indicators MUST NOT be treated as proof that a request will succeed.
- Pending writes MUST NOT be silently discarded.
## SHOULD
- Read experiences SHOULD degrade to useful cached data when product semantics permit.
## Exceptions
Strictly online workflows may fail closed when documented and communicated before destructive user effort is lost.
## Verification
Use airplane mode, packet loss, latency, reconnect, process restart, and queued-operation tests.