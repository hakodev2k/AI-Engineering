# Streaming Generation

## Purpose
Implement reliable token streaming with correct ordering, cancellation, backpressure, accounting, and termination semantics.

## When to use
Use for interactive generation APIs where partial output reduces perceived latency.

## Inputs
API protocol, runtime streaming interface, gateway/proxy behavior, timeout policy, usage accounting, client requirements.

## Context to inspect
Buffering layers, SSE/WebSocket implementation, disconnect propagation, cancellation, proxies, load balancers, and metrics.

## Core knowledge
Streaming creates a long-lived distributed request. Every hop must preserve flushing and cancellation. Slow consumers can retain KV cache and worker capacity, so backpressure and deadlines are resource controls.

## Procedure
1. Define event schema and terminal events. 2. Ensure token/chunk ordering. 3. Disable unintended proxy buffering. 4. Propagate client disconnect and explicit cancellation to the runtime. 5. Bound server-side output buffers. 6. Enforce idle and total deadlines. 7. Define partial-output error semantics. 8. Account tokens consistently for completed and cancelled streams. 9. Test slow clients, disconnects, proxy resets, and overload. 10. Instrument TTFT, stream duration, cancellation latency, and active streams.

## Decision points
Use SSE for HTTP-friendly one-way streams; choose WebSocket only for bidirectional protocol needs. Coalesce tiny chunks when transport overhead matters without harming interactivity.

## Common failure patterns
Proxy buffering, orphaned generation after disconnect, unbounded buffers, duplicate terminal events, inaccurate usage, and retrying partially delivered generations.

## Verification
End-to-end tests must traverse production-like proxies and verify ordering, cancellation, memory release, and terminal behavior.

## Expected output
A streaming path with explicit protocol semantics, resource bounds, and failure-tested cancellation.

## Stop conditions
Stop if downstream proxies cannot support required streaming behavior or billing/accounting semantics for partial output are unresolved.