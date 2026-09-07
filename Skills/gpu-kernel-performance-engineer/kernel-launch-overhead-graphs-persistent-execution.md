# Kernel Launch Overhead, Graphs, and Persistent Execution

## Purpose
Reduce orchestration overhead when workloads consist of many short GPU kernels by choosing between ordinary launches, batched/graph execution, kernel fusion, and persistent-kernel designs.

## When to use
Use when profiler timelines show CPU launch gaps, repeated fixed kernel sequences, microsecond-scale kernels, or latency dominated by submission rather than device execution.

## Inputs
Profiler timeline, kernel DAG, launch frequency, host CPU traces, runtime API behavior, workload regularity, latency/throughput target, device-residency requirements.

## Preconditions
Separate launch overhead from kernel runtime first. Ensure correctness and dependency semantics are already stable.

## Context to inspect
Inspect CPU submission cadence, synchronization calls, repeated DAG structure, dynamic-shape variability, graph capture restrictions, persistent-state memory use, fairness, watchdog constraints, and compatibility with surrounding frameworks.

## Core knowledge
Reducing launches can improve latency, but each mechanism has trade-offs. Graphs amortize repeated scheduling for stable DAGs. Persistent kernels can eliminate repeated launches but complicate scheduling, occupancy, fairness, termination, and debugging. Fusion may reduce launches and traffic simultaneously but can inflate resources.

## Procedure
1. Measure time spent in host launch/submission versus device execution.
2. Rank repeated short-kernel sequences by cumulative overhead.
3. Remove unnecessary host synchronizations first.
4. Consider fusion when adjacent kernels share data and compatible launch geometry.
5. Consider graph/batched execution when the DAG is stable across iterations.
6. Consider persistent execution only for high-frequency work queues with strong amortization.
7. Measure capture/update overhead for dynamic parameters.
8. Evaluate resource reservation and coexistence with other workloads.
9. Test cancellation, error handling, shutdown, and watchdog behavior.
10. Compare end-to-end latency, throughput, and operational complexity across alternatives.

## Decision points
Use ordinary launches for coarse kernels or highly dynamic DAGs. Prefer graphs when structure is stable but kernel boundaries remain useful. Use persistent kernels only when launch overhead is repeatedly material and lifecycle complexity is justified.

## Common failure patterns
Using persistent kernels for long compute-bound tasks; graph-capturing unstable workflows; ignoring CPU synchronization; reducing launch count while increasing resource contention; making error recovery impossible.

## Verification
Confirm reduced submission gaps and end-to-end latency, preserved correctness, valid dependency ordering, bounded resource residency, and reliable startup/shutdown behavior.

## Expected output
A measured orchestration strategy with explicit rationale for launches, graphs, fusion, or persistence.

## Stop conditions
Escalate when runtime/framework restrictions prevent safe graph capture, persistent execution conflicts with multi-tenant scheduling, or operational risk outweighs measured performance gain.