# Measurement and Benchmarking Playbook

## Latency
Use distributions and percentiles appropriate to the journey. Record timeout/error behavior; dropped requests can make latency look artificially good.

## Throughput
Measure completed useful work, not just accepted requests.

## Resource signals
Correlate CPU, run queue, memory, allocation/GC, disk, network, connection pools, thread pools, locks, database waits, cache hit rate, queue depth, and dependency latency.

## Benchmark hygiene
Pin versions and configuration; use representative data; warm up where appropriate; avoid concurrent noisy workloads; repeat runs; preserve raw results.

## Comparison
Compare candidate against the same baseline protocol. Report absolute values, deltas, variance, and known confounders.

## Invalid runs
Invalidate runs for throttling, unrelated host pressure, broken instrumentation, unexpected data drift, dependency outage, or protocol violation.

## Production evidence
Prefer production telemetry for workload shape; use controlled environments for causal isolation.