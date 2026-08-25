# Capacity and Performance Rules

## Purpose
Ensure streaming systems meet latency and throughput objectives with defensible capacity margins.

## Scope
Applies to throughput, batching, compression, partitions, CPU, memory, network, disk, and downstream capacity.

## MUST
- Performance requirements MUST define workload shape, throughput, latency percentile, event size, and acceptable backlog.
- Capacity decisions MUST use measured workload and benchmark evidence rather than intuition alone.
- Load tests MUST include realistic key skew, payload sizes, serialization, downstream latency, and failure recovery where material.
- Headroom MUST account for peak traffic, maintenance, replica loss, and backlog catch-up.
- Performance changes MUST include before/after measurements under comparable conditions.

## MUST NOT
- MUST NOT increase partition count, batch size, or concurrency solely because average latency appears high.
- MUST NOT benchmark only happy-path in-memory processing when storage/network dominates production behavior.
- MUST NOT claim optimization from microbenchmarks that do not represent the bottleneck.

## SHOULD
- Compression and batching SHOULD be tuned against CPU, network, latency, and memory trade-offs.
- Capacity forecasts SHOULD include growth assumptions and confidence bounds.

## Exceptions
Emergency tuning may precede full benchmarking only with live evidence, reversible changes, bounded blast radius, and follow-up validation.

## Verification
Use load/soak tests, broker and host metrics, latency histograms, resource profiles, partition utilization, and comparative benchmark reports.