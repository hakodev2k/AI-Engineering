# Asynchronous Copy and Software Pipelining

## Purpose
Overlap data movement with computation inside GPU kernels using asynchronous copy, staged buffering, or software pipelines so memory latency is hidden by useful work.

## When to use
Use in tiled kernels where each iteration loads predictable data for a later compute phase and profiling shows memory stalls despite adequate parallelism.

## Inputs
Kernel loop structure, tile size, memory hierarchy, asynchronous copy primitives available on target hardware, profiler stall metrics, shared-memory capacity, register usage.

## Preconditions
The kernel must have a repeatable producer-consumer cadence and hardware/runtime support for the intended asynchronous mechanism or an equivalent staged strategy.

## Context to inspect
Inspect load-to-use distance, number of pipeline stages, shared-memory footprint, barrier/commit semantics, alignment, outstanding transaction limits, register pressure, and boundary-tile handling.

## Core knowledge
Pipelining converts latency into overlap but consumes buffering resources and adds scheduling complexity. More stages can reduce exposed latency until shared memory, registers, or instruction overhead lowers residency or throughput.

## Procedure
1. Measure baseline memory stalls and compute time per tile.
2. Identify data that can be prefetched without violating dependencies.
3. Choose a minimal two-stage pipeline as the first candidate.
4. Separate load, commit, wait, and consume phases explicitly.
5. Ensure buffer reuse happens only after consumers complete.
6. Handle first-stage warm-up and final drain correctly.
7. Measure overlap and resource growth.
8. Increase stage count only when latency remains exposed and capacity permits.
9. Test alignment and partial-tile paths.
10. Compare against a simpler synchronous version on all supported architectures.

## Decision points
Use deeper pipelines when memory latency materially exceeds compute per stage. Prefer simpler synchronous loads when computation is already long enough to hide latency through warp scheduling. Use vendor-specific async primitives only when portability policy allows.

## Common failure patterns
Adding stages without measuring; reusing a buffer too early; over-allocating shared memory; assuming asynchronous syntax guarantees overlap; mishandling tails; synchronizing the entire block when only a narrower scope is needed.

## Verification
Confirm profiler evidence of increased copy/compute overlap, lower exposed memory stalls, improved kernel runtime, valid synchronization, and stable correctness across boundary cases.

## Expected output
A documented pipeline schedule, buffering plan, resource budget, and before/after performance evidence.

## Stop conditions
Escalate when target devices lack required primitives, pipeline state becomes too complex to verify safely, or resource pressure eliminates the benefit.