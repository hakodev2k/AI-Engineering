# Benchmarking and Validation

## Purpose
Benchmark quantum implementations with fair baselines, statistically defensible metrics, and workload-relevant evidence.

## When to use
Use for backend comparison, algorithm evaluation, optimization claims, regression testing, and readiness reviews.

## Inputs
Candidate implementation, classical baseline, benchmark instances, backend set, shot budget, quality metrics, and cost/latency metrics.

## Preconditions
Success criteria and comparison rules are fixed before running experiments.

## Context to inspect
Instance distribution, compiler settings, calibration windows, seeds, optimizer budgets, queue time versus execution time, and uncertainty sources.

## Core knowledge
Quantum benchmark results are sensitive to instance selection, shot noise, calibration, transpilation, and tuning budget. Fair comparison requires equivalent problem definitions and transparent end-to-end cost.

## Procedure
1. Define primary quality and resource metrics.
2. Select representative and adversarial instances.
3. Freeze classical and quantum tuning budgets.
4. Record software, backend, calibration, and compiler versions.
5. Run warm-up separately from measured trials.
6. Repeat enough trials to estimate variance.
7. Separate queue, compile, execution, and post-processing time.
8. Report quality distributions, not only best results.
9. Compare against strong classical baselines.
10. Preserve raw results and analysis scripts.

## Decision points
Use application-level benchmarks for product claims and microbenchmarks only to isolate mechanisms. Include simulator results when they help distinguish algorithm error from hardware noise.

## Common failure patterns
Best-run reporting, cherry-picked instances, unequal tuning budgets, omitted queue/cost data, and calibration-window mixing.

## Verification
Re-run a subset independently and confirm metrics can be reproduced from raw data.

## Expected output
Benchmark protocol, raw evidence, statistical summary, baseline comparison, and bounded conclusions.

## Stop conditions
Stop when comparison conditions cannot be made equivalent or sample size is insufficient for the claimed conclusion.