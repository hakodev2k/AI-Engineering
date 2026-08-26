# WebSocket and Streaming Traffic

## Purpose
Manage long-lived and streaming connections without exhausting gateway capacity or violating protocol semantics.

## Scope
WebSockets, server-sent events, streaming HTTP, connection upgrades, and long-lived sessions.

## MUST
- Long-lived traffic MUST have explicit connection, idle, resource, and upstream limits.
- Upgrade and streaming routes MUST preserve authentication and authorization requirements.
- Capacity planning MUST account for concurrent connections, memory, file descriptors, and bandwidth.
- Draining behavior MUST protect active connections during deployments where feasible.

## MUST NOT
- MUST NOT apply ordinary request retry semantics blindly to upgraded or streaming connections.
- MUST NOT allow unbounded connection lifetimes or buffers without justified controls.
- MUST NOT bypass edge security policy during protocol upgrade.

## SHOULD
- Backpressure SHOULD be preserved end to end where supported.
- Connection lifecycle metrics SHOULD distinguish normal closure from failure.

## Exceptions
Exceptions require measured resource evidence, failure analysis, and operational approval.

## Verification
Use concurrency/load tests, upgrade tests, auth tests, drain tests, resource metrics, and failure injection.