# Atomic Operations and Contention

## Purpose
Use atomics safely while controlling serialization, contention, ordering, and scalability costs.

## When to use
Use for counters, histograms, graph updates, work queues, sparse accumulation, locks, and any kernel with concurrent updates to shared state.

## Inputs
Update semantics, contention distribution, data types, memory-order requirements, profiler metrics, and target GPU capabilities.

## Context to inspect
Atomic scope, supported operations, address hot spots, warp-level aggregation opportunities, retry behavior, memory consistency, and expected skew.

## Core knowledge
Atomics provide correctness for concurrent updates but can serialize heavily under contention. Throughput depends on address distribution, cache/memory implementation, operation type, and scope. Aggregating updates before atomics often provides the largest win.

## Procedure
1. Identify each shared update and required ordering semantics.
2. Measure contention distribution rather than assuming uniform access.
3. Determine whether updates can be privatized per thread, warp, or block.
4. Aggregate locally before issuing global atomics where possible.
5. Reduce atomic scope to the minimum required domain.
6. Consider sort/reduce or segmented alternatives for extreme contention.
7. Check overflow, ABA-like state assumptions, and unsupported atomic types.
8. Benchmark low-, medium-, and high-contention workloads.
9. Verify memory-order assumptions explicitly.

## Decision points
Use direct atomics for low-contention simple updates; use hierarchical aggregation for moderate contention; restructure the algorithm when a small number of addresses dominate traffic.

## Common failure patterns
Assuming atomics are free on modern GPUs; using global atomics for every element; relying on undocumented ordering; implementing spin locks that deadlock under scheduling constraints; and testing only uniform distributions.

## Verification
Validate exact results under stress, inspect atomic throughput and serialization metrics, and compare scalability as contention increases.

## Expected output
A contention-aware synchronization design with correctness and performance evidence.

## Stop conditions
Stop when correctness depends on memory-order semantics not guaranteed by the target API or architecture.