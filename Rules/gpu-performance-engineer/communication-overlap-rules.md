# Communication Overlap Rules

## Purpose
Overlap compute and communication only when dependencies and measured gains justify it.

## Scope
Gradient communication, pipeline stages, asynchronous collectives, prefetch, and communication streams.

## MUST
- Overlap designs MUST define data dependencies explicitly.
- Claimed overlap MUST be demonstrated in traces and end-to-end timings.
- Buffers shared between compute and communication MUST have safe ownership and completion semantics.
- Backpressure and queue growth MUST be tested under slow-peer conditions.

## MUST NOT
- MUST NOT introduce races by reading or mutating buffers before collectives complete.
- MUST NOT increase memory footprint beyond deployment limits for marginal overlap gains.
- MUST NOT optimize isolated overlap percentages while end-to-end throughput regresses.

## SHOULD
- SHOULD prioritize overlap on the critical path.
- SHOULD tune bucket or chunk sizes using representative workloads.

## Exceptions
Exceptions require dependency evidence, memory analysis, and measured end-to-end benefit.

## Verification
Inspect traces, synchronization logic, buffer lifetimes, memory measurements, and distributed benchmarks.