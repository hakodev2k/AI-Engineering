# Kernel Autotuning and Parameter Search

## Purpose
Systematically select launch geometry, tile sizes, pipeline stages, vector widths, and specialization parameters across workload shapes and GPU architectures without relying on manual folklore.

## When to use
Use when performance is sensitive to several interacting discrete parameters, no single configuration wins across shapes, or maintaining hand-tuned architecture tables has become unreliable.

## Inputs
Correct kernel, tunable parameter ranges, representative shape distribution, supported devices, benchmark harness, resource limits, compile-time and runtime specialization costs.

## Preconditions
A deterministic or statistically stable benchmark is required. Search bounds must exclude invalid resource combinations before execution.

## Context to inspect
Inspect parameter interactions, compile explosion risk, cache size for compiled variants, shape frequency, architecture capabilities, warm-up cost, occupancy, shared-memory and register limits, and deployment constraints.

## Core knowledge
Autotuning is an optimization problem with expensive evaluations and noisy measurements. The objective should be end-to-end latency or throughput under realistic distributions, not a synthetic micro-case. Search-space pruning based on hardware constraints is as important as the search algorithm.

## Procedure
1. Define the production objective and representative workload buckets.
2. Identify parameters with credible performance impact.
3. Encode hard validity constraints before benchmarking.
4. Start with a coarse search to identify useful regions.
5. Warm each candidate consistently and measure repeated trials.
6. Reject unstable candidates using variance thresholds.
7. Refine around promising configurations.
8. Record resource use and failure modes, not only runtime.
9. Choose per-shape or per-architecture specialization only when gain justifies complexity.
10. Persist tuning metadata with compiler, driver, and device identifiers.

## Decision points
Use offline tuning when deployment targets are known and startup cost matters. Use limited online tuning when hardware/workloads vary and safe caching exists. Prefer robust near-optimal settings over brittle winners with narrow margins.

## Common failure patterns
Searching invalid configurations; tuning one shape; ignoring compile time; selecting on a single timing sample; allowing thousands of variants to bloat binaries; reusing stale tuning results after compiler or GPU changes.

## Verification
Re-run top candidates independently, validate correctness, compare across workload buckets and devices, and confirm the chosen policy improves aggregate production-relevant metrics.

## Expected output
A constrained tuning space, reproducible benchmark results, selected parameter policy, and versioned tuning metadata.

## Stop conditions
Escalate when benchmark variance prevents reliable ranking, tuning cost exceeds expected savings, or specialization count becomes operationally unmanageable.