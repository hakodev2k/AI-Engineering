# I/O Performance Rules

## Purpose
Protect storage latency and throughput using measurement rather than assumption.

## Scope
Applies to read/write latency, throughput, IOPS, queue depth, tail latency, and workload interference.

## MUST
- Define performance objectives by operation type and percentile.
- Measure before and after material tuning changes under representative workloads.
- Separate device, network, filesystem, cache, and application contributors when investigating latency.

## MUST NOT
- Claim an optimization without comparable evidence.
- Tune for average latency while ignoring tail latency on critical paths.
- Benchmark with unrealistic cache warmth, dataset size, or concurrency without disclosure.

## SHOULD
- Maintain representative workload profiles and saturation tests.
- Track performance regressions across software and firmware changes.

## Exceptions
Emergency mitigations may precede full benchmarking but require follow-up measurement and review.

## Verification
Use benchmarks, histograms, queue metrics, traces, device statistics, and regression tests.