# Realtime Interaction Rules
## Purpose
Keep realtime interfaces correct under reconnects, duplication, ordering, and partial connectivity.
## Scope
WebSockets, server-sent events, subscriptions, presence, live notifications, and collaborative updates.
## MUST
- Reconnect behavior MUST define resynchronization from an authoritative state or durable cursor when missed events matter.
- Duplicate or out-of-order events MUST be handled when the transport or system can produce them.
- Subscription lifecycle MUST clean up resources and prevent duplicate listeners.
- Connectivity state MUST NOT be confused with business-operation success.
- User-visible optimistic realtime changes MUST reconcile with authoritative results.
## MUST NOT
- Event arrival order MUST NOT be assumed globally unless guaranteed by the contract.
- Infinite reconnect loops MUST NOT create uncontrolled resource or request storms.
## SHOULD
- Use bounded backoff and jitter for reconnects where appropriate.
## Exceptions
Loss-tolerant ephemeral signals may omit replay when explicitly documented.
## Verification
Integration tests should simulate disconnect, reconnect, duplicates, reorder, missed events, and multi-tab behavior.