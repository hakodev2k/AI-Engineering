# Warp Divergence and Control Flow

## Purpose
Reduce throughput loss caused by divergent execution, branch imbalance, and serialized control paths within warps or wavefronts.

## When to use
Use when profiler traces show low branch efficiency, poor active-lane utilization, or kernels contain data-dependent conditionals and irregular loops.

## Inputs
Kernel source, branch behavior, input distributions, disassembly, and profiler control-flow metrics.

## Context to inspect
Warp/wavefront width, branch predicates, loop trip counts, data partitioning, reconvergence behavior, and whether branches skip expensive work.

## Core knowledge
SIMT lanes share execution resources. Divergent branches may serialize paths, but removing a branch can be worse if it forces unnecessary expensive work. The correct objective is useful work per issued instruction, not branchlessness.

## Procedure
1. Identify branch sites with material execution cost.
2. Measure lane utilization and branch efficiency under representative data.
3. Classify divergence as predictable, data-dependent, structural, or tail-related.
4. Estimate work performed on each branch path.
5. Consider data reordering, kernel specialization, predication, warp-level compaction, or separate kernels where justified.
6. Avoid transformations that increase memory traffic more than they save control cost.
7. Benchmark representative distributions, not only uniform data.
8. Confirm behavior on edge cases and sparse workloads.

## Decision points
Keep divergent branches when they skip substantial work. Use predication for short balanced paths; use specialization or partitioning for long, highly imbalanced paths when reorganization cost is acceptable.

## Common failure patterns
Removing all branches reflexively; testing only homogeneous inputs; increasing register pressure through predication; and moving divergence into expensive preprocessing.

## Verification
Compare active-lane metrics, issued instructions, runtime, and end-to-end cost before and after changes.

## Expected output
A control-flow strategy supported by profiler evidence and workload assumptions.

## Stop conditions
Stop when workload distributions are unknown or the proposed transformation changes externally observable ordering or semantics.