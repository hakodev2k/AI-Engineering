# Benchmark Engineering

## Purpose
Create reproducible experiments that measure changes without misleading noise.

## Preconditions
Stable test objective, representative workload, controllable environment.

## Procedure
1. Define baseline, candidate, target metrics, guardrails, and allowed variance.
2. Pin software, infrastructure, dataset, and runtime configuration.
3. Define warmup, measurement window, repetitions, concurrency, and request mix.
4. Detect environmental interference before runs.
5. Execute baseline and candidate with identical protocol.
6. Compare distributions, throughput, resource use, errors, and saturation.
7. Repeat enough to detect instability rather than cherry-pick the best run.
8. Preserve raw results and exact configuration.

## Decisions
Prefer dedicated environments for microbenchmarks and noisy-host-sensitive tests. For end-to-end tests, preserve realistic dependency behavior.

## Output
Benchmark result with methodology and confidence.

## Failure handling
Invalidate runs when setup drift, throttling, unrelated load, data skew, or instrumentation failure materially affects results.

## Stop condition
The experiment can be reproduced and supports or rejects the target hypothesis.