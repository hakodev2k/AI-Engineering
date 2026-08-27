# Storage Performance Engineering

## Purpose
Diagnose and improve storage latency, IOPS, throughput, queueing, and tail behavior using evidence rather than tuning by intuition.

## When to use
Use for slow applications, SLO misses, saturation, noisy-neighbor symptoms, storage migrations, or performance validation.

## Inputs
Latency percentiles, IOPS, throughput, queue depth, block/object size, read/write ratio, concurrency, CPU, memory, network metrics, and workload traces.

## Context to inspect
Client stack, filesystem, multipathing, caches, storage controller, network, backend media, replication, throttles, and QoS.

## Core knowledge
Latency, concurrency, queue depth, and throughput interact. Average latency hides tail pain. Sequential and random access differ; synchronous writes expose durability paths; cache can distort benchmarks.

## Procedure
1. Define the user-visible performance symptom and SLO.
2. Capture end-to-end and component-level latency.
3. Characterize workload shape and concurrency.
4. Locate saturation across client, network, controller, media, or backend services.
5. Check queueing, throttling, retries, cache hit rates, and background work.
6. Reproduce with a representative benchmark where safe.
7. Change one bottleneck variable at a time.
8. Compare before/after percentiles and resource utilization.
9. Test under sustained load and failure/rebuild conditions.
10. Document limits and operational thresholds.

## Decision points
Add cache only when locality and consistency permit; increase concurrency until queueing harms latency; scale media or nodes when bottleneck is physical; optimize application I/O when request shape is inefficient.

## Common failure patterns
Benchmarking warm cache only, using unrealistic block sizes, optimizing averages, ignoring network latency, excessive queue depth, and testing idle systems while production runs rebuilds or compaction.

## Verification
Confirm improvement in production-representative tests and user-facing SLOs without unacceptable durability, consistency, or cost regressions.

## Expected output
A bottleneck analysis, measurements, remediation, validated gains, and safe operating envelope.

## Stop conditions
Stop if testing risks production integrity, workload reproduction is invalid, or changes require unapproved durability/consistency compromises.