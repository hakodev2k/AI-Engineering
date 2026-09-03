# Performance and Load Rules

## Purpose
Ensure GraphQL performance decisions are evidence-based and safe under realistic concurrency.

## Scope
Applies to resolver latency, execution overhead, downstream fan-out, concurrency, memory, CPU, and load testing.

## MUST
- Performance claims MUST be supported by before/after measurements under representative workloads.
- Critical operations MUST have latency and throughput targets tied to service objectives.
- Load tests MUST include realistic query shapes, variable distributions, concurrency, and downstream behavior.
- Optimization work MUST identify the measured bottleneck before changing architecture or implementation.
- Resource saturation behavior MUST be characterized before significant capacity increases or releases.

## MUST NOT
- MUST NOT optimize solely from intuition or microbenchmarks disconnected from production behavior.
- MUST NOT hide latency regressions by increasing timeouts without root-cause evidence.
- MUST NOT treat average latency as sufficient when tail latency affects user experience or dependency health.

## SHOULD
- SHOULD track p50, p95, p99, throughput, error rate, and dependency fan-out for important operations.
- SHOULD preserve reproducible benchmark scenarios for regressions.

## Exceptions
Temporary performance regressions require documented impact, compensating controls, acceptance owner, and follow-up criteria.

## Verification
Use load-test reports, profiling, traces, resource metrics, benchmark diffs, and production latency distributions.