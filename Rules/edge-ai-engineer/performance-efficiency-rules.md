# Performance Efficiency Rules

## Purpose
Balance responsiveness, throughput, and device power consumption using measured evidence.

## Scope
Inference latency, time-to-result, device utilization, battery impact, and workload scheduling.

## MUST
- Performance targets MUST be defined for representative device tiers and workloads.
- Measurements MUST run on physical target hardware when hardware behavior affects results.
- Optimization work MUST measure user-visible latency and device energy impact when relevant.
- Sustained workloads and tail latency MUST be evaluated in addition to isolated runs.

## MUST NOT
- MUST NOT claim efficiency improvements from theoretical compute reduction alone.
- MUST NOT accept unstable sustained behavior for a small average-latency gain without documented trade-offs.

## SHOULD
- Benchmark cold start, warm inference, sustained inference, and background execution separately when relevant.

## Exceptions
Accepted regressions require quantified impact, rationale, mitigation, and approval.

## Verification
Review device benchmarks, utilization traces, latency percentiles, battery tests, and sustained-load results.