# Streaming and Flow Control Rules

## Purpose
Keep streaming RPCs bounded and correct under slow peers.

## Scope
Streaming handlers, buffering, backpressure, lifecycle, and termination.

## MUST
- Streaming designs MUST define ordering, completion, cancellation, and partial-failure semantics.
- Producers MUST respect backpressure and bounded buffering.
- Per-stream memory and concurrency consumption MUST have defensible limits.
- Stream termination MUST release resources promptly.
- Long-lived streams MUST have appropriate liveness behavior.

## MUST NOT
- MUST NOT accumulate unbounded messages while a peer is slow.
- MUST NOT assume transport delivery equals application processing.
- MUST NOT hold scarce locks or database transactions for long stream lifetimes.

## SHOULD
- Use application acknowledgements when processing progress matters beyond transport acceptance.
- Large streams SHOULD support resumability when reconnect cost is material.

## Exceptions
High-buffer designs require measured bounds, overload behavior, and approval.

## Verification
Run slow-consumer, cancellation, reconnect, large-message, and sustained-stream tests; inspect memory, queue depth, and flow-control telemetry.