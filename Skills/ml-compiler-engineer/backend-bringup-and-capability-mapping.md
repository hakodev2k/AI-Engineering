# Backend Bring-up and Capability Mapping

## Purpose
Integrate a new CPU, GPU, NPU, or accelerator backend by converting hardware capabilities into explicit compiler legality, lowering, scheduling, runtime, and fallback rules.

## When to use
Use when adding a target backend, enabling a new hardware generation, expanding supported operators/dtypes, or stabilizing an immature backend.

## Inputs
Hardware/ISA documentation, vendor compiler/runtime APIs, supported dtypes and operators, memory hierarchy, execution model, ABI, benchmark hardware.

## Context to inspect
Inspect device discovery, capability queries, instruction/tensor-core support, memory spaces, synchronization, kernel limits, launch APIs, library calls, error codes, and existing generic lowering paths.

## Core knowledge
Backend bring-up is not just code generation. The compiler needs a truthful capability model so legality, specialization, optimization, fallback, and cache identity all agree with the actual device. Unsupported behavior should fail or fall back explicitly rather than miscompile.

## Procedure
1. Inventory hardware features, execution limits, dtypes, memory spaces, and synchronization primitives.
2. Define a machine-readable capability model or equivalent compiler interface.
3. Map generic IR operations to natively supported operations and required decompositions.
4. Establish backend legalization and code generation boundaries.
5. Define runtime ABI, artifact loading, launch, and error propagation.
6. Implement capability-gated fast paths with safe generic fallbacks.
7. Add conformance tests for each claimed capability.
8. Validate memory, synchronization, and asynchronous execution semantics.
9. Benchmark primitive kernels and representative end-to-end models.
10. Record unsupported cases and expected diagnostics.
11. Add hardware-generation/version information to artifact/cache compatibility rules.
12. Establish regression dashboards for correctness, compile time, and runtime performance.

## Decision points
Use vendor libraries when they are mature and outperform generated code; generate kernels when fusion, specialization, or unsupported patterns justify it. Expose a feature only after correctness tests prove the advertised capability.

## Common failure patterns
Assuming hardware features by device name, capability checks inconsistent across compiler/runtime, silent CPU fallback, unsupported dtype promotion, missing synchronization semantics, and optimization heuristics copied from a different architecture.

## Verification
Run capability conformance tests on real target hardware, compile unsupported cases to confirm diagnostics/fallback, inspect generated artifacts, execute end-to-end correctness suites, and benchmark against trusted vendor/reference baselines.

## Expected output
A production-ready backend integration or bring-up plan with explicit capabilities, lowering paths, fallbacks, ABI behavior, test coverage, and measured performance.

## Stop conditions
Stop if hardware documentation or runtime access is insufficient to prove semantics, required target tests cannot run, or capability claims exceed what the backend can validate safely.