# Register Pressure and Occupancy

## Purpose
Balance per-thread register use against residency, spill risk, latency hiding, and instruction efficiency.

## When to use
Use when occupancy is unexpectedly low, register spills appear, performance changes with compiler versions, or aggressive unrolling/inlining hurts throughput.

## Inputs
Compiler resource reports, disassembly, profiler metrics, launch configuration, and representative workloads.

## Context to inspect
Registers per thread, block size, architectural register-file limits, local-memory traffic, occupancy, instruction-level parallelism, and compiler allocation behavior.

## Core knowledge
Registers are the fastest per-thread storage but are a finite compute-unit resource. Reducing registers can increase occupancy yet worsen recomputation, spills, or instruction count. Senior optimization seeks the best throughput point, not a maximum occupancy percentage.

## Procedure
1. Record baseline registers per thread and achieved occupancy.
2. Check for local-memory spill loads/stores.
3. Identify long live ranges, large private arrays, excessive temporaries, and unrolling effects.
4. Estimate occupancy thresholds where one fewer register allocation tier changes residency.
5. Test source transformations that shorten live ranges or reduce temporary state.
6. Use compiler launch bounds or register caps only as controlled experiments.
7. Compare instruction count, spill traffic, occupancy, and runtime together.
8. Recheck across important architectures and compiler versions.

## Decision points
Accept lower occupancy when instruction-level parallelism and cache behavior compensate. Reduce register usage only when residency or spills are demonstrably limiting performance.

## Common failure patterns
Forcing register caps blindly; equating 100% occupancy with peak performance; hiding spills in synthetic inputs; and changing precision solely to save registers without numerical review.

## Verification
Verify runtime, spill traffic, register allocation, achieved occupancy, and numerical correctness before and after changes.

## Expected output
A justified register/occupancy trade-off with evidence and architecture notes.

## Stop conditions
Stop when tuning requires undocumented compiler behavior or numerical changes that lack approval.