# Performance Benchmark Rules

## Purpose
Ensure performance decisions are based on reproducible evidence rather than intuition.

## Scope
Latency, throughput, connection rate, CPU, memory, bandwidth, TLS cost, and proxy overhead.

## MUST
- Performance claims MUST include before/after measurements under comparable conditions.
- Benchmarks MUST describe workload shape, concurrency, protocol, payload sizes, connection reuse, backend behavior, and test environment.
- Tail latency and saturation MUST be evaluated alongside throughput.
- Tests MUST identify whether the load balancer, network, backend, or client generator is the bottleneck.
- Performance changes MUST preserve correctness and reliability requirements.

## MUST NOT
- MUST NOT report throughput without identifying error rate and saturation state.
- MUST NOT extrapolate small synthetic tests to production scale without stating uncertainty.
- MUST NOT optimize a proxy setting that shifts unacceptable load downstream.

## SHOULD
- Use production-derived workload distributions where privacy and safety permit.
- Repeat tests enough to distinguish signal from noise.

## Exceptions
When direct benchmarking is impossible, use production telemetry or analytical capacity evidence and document limitations.

## Verification
Review benchmark scripts, raw results, environment details, percentiles, resource metrics, errors, and reproducibility.