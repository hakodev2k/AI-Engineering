# Realtime UI

## Purpose
Implement reliable realtime browser experiences over WebSocket, Server-Sent Events, subscriptions, or similar transports with ordering, reconnection, deduplication, and state reconciliation.

## When to use
Use for chat, notifications, live dashboards, collaborative state, presence, progress updates, or server-pushed events.

## Inputs
Realtime protocol, event schema, ordering guarantees, authentication, reconnect semantics, server retention/replay capability, and UX expectations.

## Context to inspect
Connection lifecycle, subscriptions, event IDs, state store/cache, heartbeat behavior, auth renewal, browser background behavior, and fallback polling.

## Core knowledge
Connections fail routinely. Realtime correctness depends on event identity, ordering guarantees, replay gaps, reconnect strategy, and authoritative state reconciliation. Delivery does not imply exactly-once processing.

## Procedure
1. Define what state is authoritative and what events mean.
2. Document ordering, duplication, and replay guarantees.
3. Establish authenticated connection/subscription lifecycle.
4. Make event processing idempotent where possible.
5. Track sequence/event identifiers when supported.
6. Reconnect with bounded exponential backoff and jitter.
7. Detect gaps and resynchronize authoritative state.
8. Unsubscribe/cleanup on ownership changes.
9. Handle background tabs, network transitions, and auth expiry.
10. Test duplicate, missing, reordered events and reconnect storms.

## Decision points
Use SSE for simple server-to-client streams, WebSocket for bidirectional low-latency interaction, and polling when realtime complexity is not justified. Re-fetch authoritative state after uncertain gaps rather than inventing client consistency.

## Common failure patterns
Assuming exactly-once delivery, duplicate listeners, reconnect storms, stale auth, memory leaks, out-of-order overwrites, and treating connection status as data correctness.

## Verification
Fault injection demonstrates reconnection, duplicate tolerance, gap recovery, and cleanup; UI converges to authoritative state after disruptions.

## Expected output
A resilient realtime client with explicit lifecycle, consistency, recovery, and observability behavior.

## Stop conditions
Stop when server delivery guarantees are undocumented, event identity is insufficient for safe reconciliation, or authentication/replay requirements cannot support the requested UX.