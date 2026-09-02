# Warp-Level Primitives

## Purpose
Use warp/wavefront shuffle, ballot, vote, match, and lane operations to exchange data and coordinate threads without unnecessary shared memory or block-wide synchronization.

## When to use
Use for reductions, scans, voting, compaction, small transposes, segmented operations, and algorithms naturally scoped to a warp/wavefront.

## Inputs
Kernel logic, subgroup width assumptions, target APIs, data types, active-lane masks, and profiler data.

## Context to inspect
Subgroup semantics, synchronization guarantees, partial warps, divergence, portability requirements, and supported intrinsics.

## Core knowledge
Warp-level primitives can reduce latency and shared-memory traffic, but correctness depends on active masks and subgroup assumptions. Portable code must not silently assume a fixed width when the execution model permits variation.

## Procedure
1. Identify communication currently performed within a subgroup.
2. Define participating lanes and valid masks explicitly.
3. Choose shuffle, ballot, vote, match, or subgroup reduction semantics that fit the operation.
4. Handle partial and divergent subgroups safely.
5. Remove redundant shared-memory staging and barriers only after proving equivalence.
6. Check register pressure introduced by lane-local state.
7. Benchmark against the shared-memory baseline.
8. Validate across supported architectures and subgroup widths.

## Decision points
Prefer subgroup primitives for tightly scoped communication; use shared memory when communication crosses subgroups or portability abstractions make subgroup assumptions unsafe.

## Common failure patterns
Using full masks after divergence; assuming 32 lanes everywhere; reading inactive lanes; removing needed synchronization; and optimizing tiny communication while increasing register pressure materially.

## Verification
Test partial groups, divergent control flow, odd sizes, and multiple architectures. Confirm lower synchronization/memory cost and unchanged results.

## Expected output
A safe subgroup communication design with explicit lane assumptions and benchmark evidence.

## Stop conditions
Stop when the target execution model does not guarantee required subgroup semantics or portability requirements prohibit the assumption.