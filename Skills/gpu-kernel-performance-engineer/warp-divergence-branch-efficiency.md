# Warp Divergence and Branch Efficiency

## Purpose
Reduce performance loss from divergent control flow while preserving correctness and avoiding transformations that increase memory traffic or instruction count more than they save.

## When to use
Use when profiler data shows branch divergence, low active-lane efficiency, irregular predicates, or workload classes with highly variable per-element control flow.

## Inputs
Kernel source, branch conditions, workload distributions, profiler branch/active-lane metrics, generated code, data layout.

## Preconditions
A representative input distribution is required because divergence may be benign on one dataset and severe on another.

## Context to inspect
Inspect warp/wavefront execution semantics, branch reconvergence, predication, loop trip-count variance, sparse masks, early exits, data ordering, and interactions with memory coalescing.

## Core knowledge
Divergent lanes within the same execution group serialize mutually exclusive paths. Some short branches are predicated efficiently, and eliminating a branch can increase wasted instructions. Data reordering can improve coherence but may add preprocessing or destroy locality.

## Procedure
1. Identify branches inside hot regions and measure active-lane efficiency.
2. Correlate divergence with specific input classes.
3. Determine whether branches are short enough for predication to be cheap.
4. Separate fast common paths from rare expensive paths when feasible.
5. Consider grouping or reordering work by behavior if preprocessing cost is amortized.
6. Replace branch-heavy formulations with arithmetic or lookup approaches only when instruction cost is lower.
7. Keep memory access coalescing visible during any control-flow rewrite.
8. Benchmark both average and adversarial input distributions.
9. Inspect generated code to confirm the compiler emitted the expected control flow.
10. Validate that changes do not alter numerical or boundary semantics.

## Decision points
Accept divergence when alternative work duplication is more expensive. Split kernels when distinct paths are large and separable. Reorder data only when the resulting coherence benefit exceeds sorting/scatter overhead.

## Common failure patterns
Removing every branch; measuring only branch efficiency rather than runtime; introducing uncoalesced accesses; duplicating expensive work under predicates; tuning to unrealistic uniform data.

## Verification
Confirm improved active-lane behavior or reduced serialized path cost, lower kernel runtime, correct results, and no adverse memory-traffic regression.

## Expected output
A divergence analysis tied to workload characteristics and a measured control-flow strategy.

## Stop conditions
Escalate when divergence is intrinsic to the domain, workload ordering is externally fixed, or mitigation would require a broader algorithm redesign.