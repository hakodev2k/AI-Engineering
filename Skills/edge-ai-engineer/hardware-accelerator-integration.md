# Hardware Accelerator Integration

## Purpose
Integrate NPUs, DSPs, GPUs, TPUs, and vendor accelerators into edge inference pipelines without sacrificing correctness, debuggability, or fallback behavior.

## When to use
Use when enabling a new accelerator, optimizing inference placement, removing CPU bottlenecks, or investigating why nominal accelerator support does not deliver expected performance.

## Inputs
Target hardware, vendor SDK/runtime, model graph, supported operator list, compiler settings, profiling tools, power/thermal limits, and fallback requirements.

## Preconditions
A working CPU or reference-runtime baseline must exist for correctness comparison.

## Context to inspect
Execution providers, graph partitioning, compiled artifacts, memory-copy boundaries, tensor layouts, driver/firmware versions, precision modes, and unsupported operators.

## Core knowledge
Accelerator performance depends on graph coverage and data movement as much as peak TOPS. A small unsupported subgraph can force costly device-host transfers. Vendor compilers may fuse operations, alter precision, require static shapes, or cache hardware-specific artifacts.

## Procedure
1. Record the reference model's correctness and device-level performance.
2. Confirm hardware, driver, firmware, compiler, and runtime compatibility.
3. Compile or partition the model with diagnostic output enabled.
4. Inspect accelerator coverage operator by operator.
5. Identify host-device copies and layout conversions.
6. Remove or rewrite unsupported operations only when semantics remain correct.
7. Tune static shapes, batch size, precision, and memory arenas as supported.
8. Measure cold compile/load and steady-state execution separately.
9. Test fallback behavior explicitly rather than assuming it is harmless.
10. Validate sustained operation under thermal load.
11. Lock known-good toolchain versions and document upgrade tests.

## Decision points
Prefer full or large contiguous accelerator subgraphs over fragmented offload. Use CPU fallback when reliability matters more than small latency gains, but measure its worst-case effect. Accept vendor-specific model variants only when performance value exceeds lifecycle complexity.

## Common failure patterns
Quoting theoretical accelerator throughput, silent CPU fallback, excessive tensor copies, incompatible cached binaries, relying on undocumented compiler behavior, and ignoring driver/firmware coupling.

## Verification
Inspect execution traces, verify numerical outputs against the baseline, benchmark latency distributions and memory copies, and run sustained thermal/power tests.

## Expected output
A reproducible accelerator integration with known graph coverage, toolchain versions, measured gains, and safe fallback behavior.

## Stop conditions
Stop when accelerator execution changes required semantics, toolchain compatibility is unknown, or performance gains disappear after end-to-end measurement.