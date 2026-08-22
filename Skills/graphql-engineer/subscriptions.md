# GraphQL Subscriptions

## Purpose
Implement reliable real-time GraphQL delivery with explicit lifecycle, authorization, scaling, and backpressure behavior.

## When to use
Use when clients need server-pushed domain updates and polling is materially worse.

## Inputs
Event sources, subscription schema, transport, authorization model, delivery expectations, and scale targets.

## Context to inspect
Inspect WebSocket/SSE infrastructure, brokers, connection limits, authentication refresh, event fan-out, filtering, reconnect behavior, and deployment topology.

## Core knowledge
Subscriptions create long-lived state and operational cost. GraphQL transport does not guarantee durable exactly-once delivery. Clients must handle disconnects, duplicates, and missed events according to product needs.

## Procedure
1. Confirm real-time delivery is justified.
2. Define event semantics and payload shape.
3. Authenticate connection and authorize subscription scope.
4. Choose transport supported by clients and infrastructure.
5. Connect subscription events to a scalable broker when multiple instances exist.
6. Bound per-connection subscriptions and buffers.
7. Define reconnect and resume behavior.
8. Revalidate permissions when long-lived authorization can change.
9. Instrument connections, drops, lag, fan-out, and errors.
10. Load-test reconnect storms and slow consumers.

## Decision points
Use polling for low-frequency data when operational simplicity wins. Use durable event streams outside GraphQL when consumers require replay or strong delivery guarantees.

## Common failure patterns
In-memory pub/sub across multiple instances, unlimited connections, stale authorization, no slow-consumer policy, assuming events cannot be missed, and leaking tenant events through broad topics.

## Verification
Test connect/disconnect, authorization, horizontal scaling, duplicate/missed-event behavior, broker outage, and slow consumers.

## Expected output
An operationally bounded real-time GraphQL capability with documented delivery semantics.

## Stop conditions
Stop if consumers require durability/replay that the chosen subscription architecture cannot provide.