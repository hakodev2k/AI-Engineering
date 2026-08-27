# Performance Measurement Rules

## Purpose
Require reproducible evidence for GPU performance claims.

## Scope
Benchmarks, optimization work, regressions, capacity studies, and hardware comparisons.

## MUST
- Performance claims MUST include before/after measurements on representative workloads.
- Benchmarks MUST state hardware, software stack, precision, shapes, batch/concurrency, warm-up, and measurement method.
- Measurements MUST separate initialization from steady-state behavior when operationally relevant.
- Latency reports MUST include distribution statistics when tail latency matters.
- Throughput comparisons MUST preserve correctness and output-quality requirements.

## MUST NOT
- MUST NOT infer improvement from kernel duration alone when end-to-end latency is the objective.
- MUST NOT cherry-pick favorable runs or compare materially different configurations without disclosure.
- MUST NOT report theoretical FLOPS as achieved workload performance.

## SHOULD
- Automate regression thresholds for stable representative benchmarks.
- Record profiler evidence for material optimizations.

## Exceptions
Synthetic microbenchmarks may guide local optimization but cannot establish end-to-end benefit alone.

## Verification
Inspect benchmark scripts, raw results, environment metadata, profiler captures, statistical summaries, and correctness checks.