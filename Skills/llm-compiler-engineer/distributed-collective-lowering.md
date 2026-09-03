# Distributed Collective Lowering

## Purpose
Lower tensor-parallel, pipeline-parallel, or expert-parallel communication into correct and efficient collective operations coordinated with computation.

## When to use
Use when compiling multi-GPU LLMs, adding sharding strategies, overlapping communication, or debugging distributed correctness and performance.

## Inputs
- Sharding/partition specification
- Distributed IR or annotated graph
- Device topology
- Collective runtime capabilities
- Tensor shapes and dtypes

## Preconditions
Know device ranks, process groups, sharding semantics, and whether graph transformations change collective ordering.

## Context to inspect
Inspect all-reduce, all-gather, reduce-scatter, all-to-all, point-to-point transfers, stream usage, group creation, topology, tensor layouts, and failure handling.

## Core knowledge
Collectives are stateful synchronization points whose order must agree across participants. Performance depends on message size, topology, algorithm selection, overlap, and tensor layout. Communication can often be reduced via reduce-scatter/all-gather transformations or hidden behind independent computation.

## Procedure
1. Derive communication requirements from sharding semantics.
2. Select the minimal collective primitive for each boundary.
3. Validate tensor shape, dtype, rank, and group consistency.
4. Establish deterministic collective ordering.
5. Choose communication layout and chunking.
6. Identify legal computation/communication overlap.
7. Insert explicit events or dependencies for asynchronous collectives.
8. Add topology-aware choices where runtime support exists.
9. Test multiple world sizes and uneven/boundary shapes.
10. Profile communication time, overlap, bandwidth, and idle gaps.

## Decision points
Use reduce-scatter plus all-gather when it reduces communication or improves overlap versus all-reduce. Use all-to-all for expert routing only when topology and load balance support it. Keep synchronization conservative when effects or ordering are uncertain.

## Common failure patterns
- Different collective order across ranks.
- Incorrect sharding-to-layout mapping.
- Hidden synchronization eliminating intended overlap.
- Tiny collectives dominated by latency.
- Assuming uniform topology or balanced expert traffic.

## Verification
Implemented means distributed execution completes. Verified means outputs match an unsharded or trusted reference, multiple ranks/world sizes pass, deadlock tests succeed, and traces show expected communication volume and overlap.

## Expected output
A collective lowering plan with ordering invariants, topology considerations, tests, and distributed profiling evidence.

## Stop conditions
Stop when sharding semantics or process groups are ambiguous, topology/runtime guarantees are unavailable, or collective ordering cannot be made deterministic.