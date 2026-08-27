# Ring Buffer Event Pipelines

## Purpose
Design reliable high-rate eBPF event delivery from kernel to user space with bounded loss and overhead.

## When to use
Use for traces, security events, network metadata, profiling samples, and diagnostics.

## Inputs
Event schema, expected/peak rates, latency target, loss tolerance, CPU/memory budget, consumer architecture.

## Context to inspect
Inspect ring-buffer support, existing perf buffers, event sizing, reserve/submit paths, consumer polling, backpressure and drop telemetry.

## Core knowledge
Kernel event producers must remain bounded. Consumers can fall behind; no design should assume infinite buffering. Event schemas need stable size/version discipline.

## Procedure
1. Quantify peak event rate and acceptable loss.
2. Minimize kernel event payload to required fields.
3. Define versioned event records and alignment.
4. Size buffer from burst behavior and memory budget.
5. Handle reserve failure explicitly and count drops.
6. Build non-blocking consumer processing with decoupled enrichment.
7. Apply sampling/filtering before emission where safe.
8. Load-test producer and consumer independently.
9. Expose occupancy/drop/lag health signals.

## Decision points
Prefer ring buffer when global ordering and modern support matter; perf buffers may suit older support matrices. Aggregate in kernel when it safely removes large event volume.

## Common failure patterns
Oversized events, synchronous enrichment in the poll loop, invisible drops, no schema versioning, and buffer sizing from average rather than bursts.

## Verification
Replay representative peak workloads, force consumer slowdown, confirm drop accounting, ordering expectations, CPU cost, and graceful recovery.

## Expected output
A measured event pipeline with explicit loss semantics and observability.

## Stop conditions
Stop if required losslessness cannot be met by this transport or overhead exceeds budget.