# Storage Performance Rules

## Purpose
Maintain predictable latency, throughput, and IOPS using measurement rather than intuition.

## Scope
Devices, arrays, networks, clients, caches, queues, and storage services.

## MUST
- Performance requirements MUST define workload shape, concurrency, block/object size, read/write mix, latency percentiles, and durability mode where relevant.
- Performance changes MUST be supported by comparable before-and-after measurements.
- Bottleneck analysis MUST consider client, network, protocol, queue, media, metadata, and backend contention.
- Benchmarks MUST represent production-relevant behavior before they justify architecture decisions.

## MUST NOT
- MUST NOT claim improvement from average latency alone when tail latency is material.
- MUST NOT benchmark with unsafe caching or durability settings unless clearly identified as non-production.
- MUST NOT tune blindly across multiple layers without isolating evidence.

## SHOULD
- Establish workload-specific baselines and regression thresholds.

## Exceptions
Synthetic-only evidence is acceptable for early design if its limitations are documented and production validation follows.

## Verification
Review benchmark methods, telemetry, percentile latency, queue depth, saturation signals, and reproducible test results.