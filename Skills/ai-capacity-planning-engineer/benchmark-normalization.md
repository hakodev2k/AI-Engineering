# Benchmark Normalization

## Purpose
Convert heterogeneous AI benchmark results into comparable, planning-grade capacity metrics.

## When to use
Use when comparing models, accelerator types, serving engines, quantization modes, or vendor benchmarks.

## Inputs
Raw benchmark outputs, model/configuration details, token distributions, batch sizes, latency targets, hardware specs, software versions.

## Preconditions
Benchmark methodology and test environment are known.

## Context to inspect
Prompt/output lengths, concurrency, warm-up, precision, batching, parallelism, clock/power settings, runtime versions, SLO thresholds.

## Core knowledge
Benchmark numbers are only comparable when workload shape and quality constraints are aligned. Peak tokens/sec measured at unacceptable latency is not usable capacity.

## Procedure
1. Record complete benchmark configuration.
2. Normalize input/output token mix and concurrency.
3. Separate prefill and decode behavior when relevant.
4. Exclude warm-up anomalies unless startup is part of the objective.
5. Calculate throughput at the required latency percentile.
6. Normalize per accelerator and per dollar when useful.
7. Flag quality-changing optimizations such as quantization.
8. Repeat representative runs and capture variance.
9. Publish comparable capacity units with assumptions.

## Decision points
Reject benchmark comparisons when workload shape differs too much to normalize credibly. Re-run tests instead of applying speculative conversion factors.

## Common failure patterns
Comparing vendor peak results to internal production tests, ignoring p99 latency, mixing precisions, and omitting model/version details.

## Verification
A second engineer can reproduce the normalized result from raw data and recorded configuration.

## Expected output
A benchmark table containing comparable usable-capacity metrics and confidence notes.

## Stop conditions
Stop when key benchmark configuration is missing or quality impact cannot be assessed.