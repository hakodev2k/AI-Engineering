# Autotuning and Schedule Search

## Purpose
Design reproducible autotuning systems that select efficient schedules, tile sizes, vector widths, and kernel variants for ML workloads across hardware and shapes.

## When to use
Use when static heuristics underperform, when integrating a new backend, or when performance depends strongly on shape and device characteristics.

## Inputs
Candidate schedules, target hardware, benchmark harness, shape distribution, compilation budget, cache strategy, correctness oracle.

## Context to inspect
Inspect search space size, compilation latency, benchmark variance, warm-up behavior, cache keys, hardware counters, timeout policy, and invalid schedule handling.

## Core knowledge
Autotuning is an optimization problem under measurement noise and finite budget. Search spaces must encode legal candidates and avoid wasting time on dominated configurations. Tuning results are valid only for the conditions represented by their cache keys.

## Procedure
1. Define the performance objective and tuning budget.
2. Enumerate legal schedule parameters and constraints.
3. Remove obviously dominated or duplicate candidates.
4. Define stable benchmark methodology with warm-up and repeated measurement.
5. Establish correctness checks before accepting a candidate.
6. Choose exhaustive, heuristic, Bayesian, evolutionary, or learned search based on space size and budget.
7. Define cache keys using relevant shape, dtype, layout, device, and compiler-version properties.
8. Add timeouts and failure isolation for invalid kernels.
9. Compare tuned results against robust static baselines.
10. Persist provenance and confidence for selected variants.
11. Monitor cache hit rate and tuning overhead in production.

## Decision points
Use static heuristics when compile latency matters more than small runtime gains. Tune per shape only when shape repetition amortizes cost. Bucket similar shapes when exact specialization would explode cache cardinality.

## Common failure patterns
Benchmark noise choosing unstable winners, missing correctness checks, cache poisoning across devices, oversized search spaces, overfitting to synthetic shapes, and tuning cost exceeding runtime savings.

## Verification
Repeat selected benchmarks, test correctness across candidates, validate cache reuse, compare end-to-end latency including tuning, and confirm wins on representative workloads.

## Expected output
A bounded autotuning strategy with legal search space, measurement protocol, cache policy, selected schedules, and performance evidence.

## Stop conditions
Stop if benchmark noise exceeds expected gains, tuning cannot be amortized, cache identity is unsafe, or candidate generation can produce unbounded resource usage.