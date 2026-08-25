# Messaging Performance Tuning

## Purpose
Improve messaging throughput and latency using evidence from brokers, clients, storage, and networks rather than unsafe configuration guessing.

## When to use
Use when p95/p99 publish or consume latency regresses, throughput plateaus, CPU/disk/network saturates, or SLA targets are missed.

## Inputs
- Latency and throughput targets
- Broker metrics
- Client metrics
- Message size distribution
- Load-test results

## Context to inspect
Inspect batching, compression, acknowledgements, partition balance, page cache, disk latency, network, garbage collection, consumer lag, and throttling.

## Core knowledge
Performance is a pipeline property. Tuning one component can shift the bottleneck or weaken durability. Senior engineers should distinguish throughput, latency, tail latency, and recovery capacity.

## Procedure
1. Reproduce the workload with representative message sizes and concurrency.
2. Establish baseline throughput and latency percentiles.
3. Identify the saturated resource or queueing point.
4. Change one high-leverage parameter at a time.
5. Tune batching, compression, fetch/prefetch, and concurrency only with measurements.
6. Check partition or queue skew.
7. Validate storage and network limits.
8. Re-run failure-state tests after tuning.
9. Record before/after results and durability impact.

## Decision points
Increase batching for throughput when added latency is acceptable. Add partitions or consumers when parallelism is limiting. Scale infrastructure when clients are already efficient and the broker is resource-bound.

## Common failure patterns
- Tuning from averages only
- Increasing batch sizes until tail latency becomes unacceptable
- Trading durability for speed without approval
- Ignoring hot partitions
- Benchmarking with unrealistic tiny messages

## Verification
Compare p50/p95/p99 latency, throughput, resource saturation, error rate, and recovery behavior against the baseline under the same workload.

## Expected output
A measured tuning report with bottleneck evidence, changes, trade-offs, and validated results.

## Stop conditions
Stop when production-like workload cannot be reproduced, metrics contradict the assumed bottleneck, or tuning would weaken required delivery guarantees.