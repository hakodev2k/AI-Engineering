# Subscription Rules

## Purpose
Keep GraphQL subscriptions secure, bounded, and operationally predictable over long-lived connections.

## Scope
Applies to subscription schemas, connection lifecycle, event filtering, transport, authorization, backpressure, and delivery guarantees.

## MUST
- Subscription authorization MUST be enforced at connection and event-delivery boundaries when policy can change during the session.
- Connection lifetime, heartbeat, expiry, reconnection, and resume behavior MUST be documented.
- Event streams MUST enforce bounded buffering and backpressure or explicit drop semantics.
- Subscription filters MUST prevent cross-tenant or unauthorized event disclosure.
- Delivery semantics MUST state whether events may be duplicated, dropped, or reordered.

## MUST NOT
- MUST NOT keep expired or revoked identities authorized indefinitely on long-lived connections.
- MUST NOT buffer unbounded events per subscriber.
- MUST NOT assume exactly-once delivery unless the end-to-end design demonstrably provides it.

## SHOULD
- SHOULD expose observability for connection count, lag, drops, and delivery failures.
- SHOULD keep subscription payloads compatible with corresponding query types where practical.

## Exceptions
Exceptions require documented reliability and security trade-offs, bounded impact, and reviewer approval.

## Verification
Use revocation tests, reconnect tests, load tests, backpressure tests, tenant-isolation tests, and production stream metrics.