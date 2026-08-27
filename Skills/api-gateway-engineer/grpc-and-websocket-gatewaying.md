# gRPC and WebSocket Gatewaying

## Purpose
Proxy long-lived and non-REST application protocols correctly through the gateway.

## When to use
Use for gRPC, streaming RPC, WebSocket, or bidirectional streaming traffic.

## Inputs
Protocol requirements, connection durations, message sizes, keepalive settings, backend capabilities.

## Context to inspect
HTTP/2 support, upgrade handling, idle timeouts, load balancing, connection draining, retries, observability.

## Core knowledge
Understand HTTP/2 multiplexing, gRPC status mapping, streaming deadlines, WebSocket upgrades, sticky routing needs, flow control, and long-lived connection impact.

## Procedure
1. Confirm end-to-end protocol support.
2. Preserve required upgrade or HTTP/2 semantics.
3. Set idle and maximum connection durations deliberately.
4. Define message/body limits.
5. Avoid retries after streaming side effects begin.
6. Configure draining for deployments.
7. Observe connection counts, stream resets, and backend status.
8. Test disconnects, failover, long streams, and deployment rotation.

## Decision points
Use native protocol proxying when possible; transcoding adds coupling and must be justified. Sticky routing only when backend state requires it.

## Common failure patterns
HTTP/1-only hops for gRPC, short idle timeouts, retrying partially completed streams, abrupt connection termination during deploys.

## Verification
Protocol conformance, long-duration load, drain, disconnect, and error-mapping tests pass.

## Expected output
Stable protocol-specific gateway policy with bounded operational behavior.

## Stop conditions
Escalate when backend protocol semantics or statefulness are unclear.