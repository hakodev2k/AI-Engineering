# Streaming and Realtime Developer Experience

## Purpose
Design clear developer primitives for streaming and realtime AI interactions, including partial output, cancellation, ordering, reconnects, and failure recovery.

## When to use
Use for token streaming, speech, multimodal realtime sessions, event streams, or long-running incremental operations.

## Inputs
Transport protocol, event schema, SDK behavior, connection lifecycle, timeout policy, ordering guarantees, resumability, authentication, and latency targets.

## Context to inspect
Inspect wire events, client state machines, SDK iterators/callbacks, disconnect behavior, browser/network constraints, backpressure, telemetry, and example applications.

## Core knowledge
Streaming converts a simple request/response API into a stateful protocol. Developers need explicit event types, terminal states, cancellation, error semantics, and resource cleanup. Fast first output is not sufficient if streams leak resources or cannot recover safely.

## Procedure
1. Define session and stream lifecycle states.
2. Specify event types, ordering, identifiers, and terminal events.
3. Define partial-output semantics and whether partial content is usable after failure.
4. Specify cancellation and server cleanup.
5. Define timeout, heartbeat, and idle behavior.
6. Decide reconnect and resume semantics.
7. Implement SDK abstractions that preserve lower-level events when needed.
8. Add backpressure and bounded buffering.
9. Expose latency and connection diagnostics.
10. Test disconnects, duplicated events, delayed events, cancellation, and server errors.

## Decision points
Use resumable streams only when the protocol can guarantee a stable continuation point. Prefer simple iterators for linear text streams and richer event APIs for multimodal or tool-driven sessions.

## Common failure patterns
Treating streaming as chunked text only, losing final usage metadata, no cancellation, unbounded client buffers, ambiguous reconnects, duplicated side effects, and hidden terminal errors.

## Verification
Run fault-injection tests across disconnect, timeout, cancellation, slow consumers, and reconnect scenarios. Confirm resources are released and event ordering guarantees match documentation.

## Expected output
A documented streaming protocol, SDK abstraction, examples, failure semantics, and reliability tests.

## Stop conditions
Escalate when resume guarantees cannot be defined, side effects may repeat after reconnect, or transport constraints make advertised behavior unreliable.