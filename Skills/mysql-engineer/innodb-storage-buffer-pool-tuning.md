# InnoDB Storage and Buffer Pool Tuning

## Purpose
Tune InnoDB memory and storage behavior from workload evidence while preserving stability.

## When to use
Use for I/O pressure, cache misses, checkpoint stalls, memory pressure, or capacity reviews.

## Inputs
Host/container limits, dataset/index sizes, buffer-pool metrics, I/O latency, dirty-page metrics, workload profile.

## Context to inspect
Buffer pool size, redo capacity, flush behavior, storage latency/IOPS, swap, competing processes, working-set size.

## Core knowledge
InnoDB performance depends on the working set fitting available cache, sustainable redo/checkpoint behavior, and storage latency. More memory is not automatically safer when the OS or container can OOM.

## Procedure
1. Establish memory and I/O baselines.
2. Measure working set and buffer-pool hit/miss behavior.
3. Check dirty pages, flushing, checkpoint age, redo pressure, and stalls.
4. Verify host/container memory headroom.
5. Change one bounded parameter set at a time.
6. Test sustained writes and recovery implications.
7. Observe p95/p99 latency, I/O, memory, and throughput.
8. Keep changes only when evidence improves workload objectives.

## Decision points
Increase cache when misses are material and memory headroom exists. Increase redo capacity when checkpoint pressure is causal, while accounting for crash recovery time.

## Common failure patterns
Copying generic tuning formulas, allocating nearly all RAM, hiding slow storage with oversized caches, and optimizing hit ratio without user latency evidence.

## Verification
Compare workload latency, physical reads/writes, flush stalls, memory headroom, and restart/recovery behavior.

## Expected output
Measured tuning change with baseline, rationale, limits, and rollback values.

## Stop conditions
Stop on OOM risk, worsening tail latency, storage saturation, or inability to measure production-representative behavior.