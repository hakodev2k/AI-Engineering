# GPU Performance and Benchmarking Rules

## Purpose
Ensure performance decisions are supported by reproducible evidence and do not sacrifice correctness, reliability, or isolation.

## Scope
Applies to GPU utilization, throughput, latency, collective communication, kernel efficiency, end-to-end benchmarks, and tuning claims.

## MUST
- Performance changes MUST include a defined baseline, representative workload, test conditions, and before/after measurements.
- Benchmarks MUST record accelerator model, topology, driver/runtime versions, workload size, precision, concurrency, and material system configuration.
- End-to-end bottleneck analysis MUST consider GPU compute, memory, CPU, network, storage, synchronization, and scheduler effects.
- Performance regressions on critical workload classes MUST be detected before broad rollout when practical.
- Optimization MUST preserve required numerical correctness, security, and reliability properties.

## MUST NOT
- Peak theoretical throughput MUST NOT be reported as achieved application performance.
- A microbenchmark improvement MUST NOT be generalized to production throughput without representative validation.
- Warm caches or cherry-picked runs MUST NOT be silently compared against cold or differently configured baselines.

## SHOULD
- Benchmarks SHOULD report variance and repeated runs where noise is material.
- Tuning SHOULD prioritize the dominant measured bottleneck.

## Exceptions
Exceptions require documented test limitations, uncertainty, and reviewer-visible evidence.

## Verification
Review benchmark scripts, raw results, environment metadata, workload traces, profiler evidence, regression gates, and reproducibility on comparable hardware.