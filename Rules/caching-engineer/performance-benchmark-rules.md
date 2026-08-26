# Performance and Benchmarking

## Purpose
Require evidence that caching materially improves the intended workload.

## Scope
Latency, throughput, CPU, memory, network, origin load, and cost performance.

## MUST
- Performance claims MUST include before-and-after measurements under representative workload.
- Benchmarks MUST report hit ratio, miss cost, tail latency, throughput, resource use, and origin impact relevant to the decision.
- Test methodology MUST distinguish cold, warm, steady-state, burst, and failure conditions where material.
- Optimization MUST preserve correctness and security constraints.

## MUST NOT
- Average latency alone MUST NOT justify production performance claims where tail latency matters.
- Synthetic microbenchmarks MUST NOT be presented as end-to-end capacity evidence.
- Hit rate MUST NOT be optimized independently of freshness, memory, and origin cost.

## SHOULD
- Use production distributions or realistic replay inputs when safe.
- Track performance regressions in CI or controlled load environments where practical.

## Exceptions
Document limitations, uncertainty, and evidence still required.

## Verification
Review benchmark code, workload assumptions, raw metrics, statistical comparisons, production telemetry, and regression thresholds.