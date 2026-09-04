# Warp Divergence and Control Flow

## Purpose
Reduce performance loss from divergent control flow, predication overhead, and uneven per-thread work while preserving clear and correct GPU algorithms.

## When to use
Use when profiler evidence shows branch-related stalls, low branch efficiency, highly variable thread work, or serialization within warps.

## Inputs
- Kernel source
- Branch and warp execution metrics
- Representative input distributions
- Baseline runtime and correctness tests

## Context to inspect
Inspect data-dependent branches, loop trip counts, early exits, sparse workloads, thread-to-data mapping, and whether divergence occurs on the critical path.

## Core knowledge
Threads in a warp execute together. Divergent paths may serialize work, but removing branches can add useless instructions or memory traffic. The goal is lower total execution time, not branch elimination by itself.

## Procedure
1. Identify divergent branches and quantify their contribution.
2. Determine whether divergence is input-dependent, structural, or mapping-related.
3. Estimate work imbalance across lanes.
4. Test reordering or grouping work with similar behavior.
5. Evaluate predication only for short, balanced branches.
6. Consider warp-level compaction or specialized kernels for strongly heterogeneous work.
7. Simplify loops with highly variable trip counts when possible.
8. Measure instruction count, branch efficiency, and kernel time after each change.
9. Validate on realistic distributions, including worst-case skew.

## Decision points
Prefer predication for short branch bodies. Prefer workload partitioning when paths perform substantially different work. Accept divergence when alternatives increase memory traffic, complexity, or total instructions more than they save.

## Common failure patterns
- Removing every branch regardless of cost
- Testing only uniform synthetic data
- Increasing preprocessing cost to reduce minor divergence
- Creating multiple specialized kernels that increase launch overhead
- Ignoring divergence caused by variable loop lengths

## Verification
Confirm lower kernel and end-to-end time, appropriate branch/warp metrics, and no correctness changes across representative and adversarial input distributions.

## Expected output
A divergence analysis with root cause, chosen mitigation, benchmark evidence, and trade-offs.

## Stop conditions
Stop when divergence is not material to runtime or mitigation adds more overhead than the serialized work it removes.