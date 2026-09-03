# Autotuning and Search

## Purpose
Build or operate an autotuning process that selects performant kernel schedules, tile sizes, fusion choices, and launch configurations for representative LLM workloads.

## When to use
Use when no single schedule performs well across shapes or hardware, when kernel parameters interact nonlinearly, or when manual heuristics have reached diminishing returns.

## Inputs
- Tunable parameter space
- Correct reference implementation
- Representative shape distribution
- Target hardware
- Benchmark harness and time budget

## Preconditions
Benchmarks must be stable enough to compare candidates. Correctness checks must run before accepting a candidate.

## Context to inspect
Inspect search-space size, compile cost, warmup, clock variability, caching, hardware counters, shape frequency, and deployment constraints.

## Core knowledge
Autotuning is an optimization problem under expensive evaluation. Search spaces should encode legal configurations and prune obviously bad regions. Benchmark noise can easily select false winners. The best objective may be p95 latency, throughput, energy, memory, or a weighted workload score rather than isolated kernel time.

## Procedure
1. Define the target metric and workload distribution.
2. Identify high-impact tunable parameters.
3. Encode legality constraints before search.
4. Establish deterministic correctness checks.
5. Define warmup and repeated-measurement protocol.
6. Start with informed baselines and coarse search.
7. Prune dominated or invalid configurations.
8. Refine around promising regions using grid, random, Bayesian, evolutionary, or domain-specific search as appropriate.
9. Cache results by hardware, shape signature, dtype, layout, and compiler version.
10. Validate winners on fresh runs and end-to-end workloads.

## Decision points
Prefer offline tuning for stable deployment targets. Use lightweight online tuning only when compilation overhead, safety, and cache behavior are controlled. Use heuristics when tuning cost exceeds expected runtime savings.

## Common failure patterns
- Selecting candidates from noisy single measurements.
- Tuning unrealistic shapes.
- Ignoring compile time or code-cache cost.
- Accepting numerically incorrect candidates because they are faster.
- Overfitting to one GPU SKU.

## Verification
Implemented means search produces candidates. Verified means selected configurations repeatedly outperform baselines on representative workloads, pass correctness checks, and remain stable across restarts and supported hardware.

## Expected output
A bounded search strategy, result cache schema, benchmark protocol, and validated winning configurations.

## Stop conditions
Stop when benchmark noise exceeds expected gains, representative workloads are unavailable, or search cost cannot be amortized.