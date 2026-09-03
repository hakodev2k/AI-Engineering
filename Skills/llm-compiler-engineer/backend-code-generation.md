# Backend Code Generation

## Purpose
Lower target-independent compiler IR into correct and efficient executable code for a specific accelerator or runtime backend.

## When to use
Use when adding a new hardware backend, implementing missing operators, changing ABI/runtime integration, or diagnosing backend-only failures.

## Inputs
- Legalized target IR
- Target ISA/runtime constraints
- ABI and calling conventions
- Shape, dtype, layout, and device metadata
- Reference outputs and benchmarks

## Preconditions
All unsupported high-level operators should already be legalized or explicitly rejected. The target runtime contract must be known.

## Context to inspect
Inspect launch APIs, kernel argument packing, alignment, address spaces, synchronization, stream semantics, constant memory, library-call integration, and generated artifacts.

## Core knowledge
Backend codegen translates semantic operations into target instructions, kernels, or optimized library calls. Correctness depends on ABI details, memory spaces, synchronization, indexing width, alignment, and asynchronous execution. Performance requires target-specific tiling, vectorization, intrinsic selection, and launch configuration.

## Procedure
1. Define the supported target-IR subset.
2. Map operations to target kernels, intrinsics, or library calls.
3. Validate argument layout, alignment, and address-space rules.
4. Emit bounds-safe indexing and synchronization.
5. Preserve stream/device ordering requirements.
6. Select launch dimensions from shape and hardware constraints.
7. Add target capability guards and fallbacks.
8. Emit readable diagnostics and optional generated-code dumps.
9. Compare outputs against reference execution.
10. Benchmark representative shapes and inspect target profiler data.

## Decision points
Use vendor libraries for mature dense kernels when they outperform generated code and preserve portability goals. Generate custom kernels when fusion, unusual layouts, dynamic behavior, or model-specific patterns justify it.

## Common failure patterns
- ABI mismatch or incorrect argument packing.
- Missing synchronization across shared state.
- 32-bit indexing overflow on large tensors.
- Incorrect assumptions about alignment.
- Generating valid but consistently inferior kernels instead of using tuned libraries.

## Verification
Implemented means the backend produces executable artifacts. Verified means semantic tests pass across supported dtypes/shapes/devices, sanitizer or validation tools find no illegal memory behavior, and performance meets defined backend targets.

## Expected output
A backend lowering path with capability checks, generated-code diagnostics, correctness coverage, and benchmark evidence.

## Stop conditions
Stop when target ABI or synchronization semantics are unknown, required hardware features are unavailable, or safe fallback execution cannot be provided.