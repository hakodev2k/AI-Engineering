# SIMD and Vectorization

## Purpose
Use Wasm SIMD safely to accelerate data-parallel hot paths while preserving portability and correctness.

## When to use
Use for image/audio processing, numerical kernels, codecs, ML primitives, or other measured vectorizable hotspots.

## Inputs
Hot-path profile, scalar implementation, data layout, compiler flags, runtime support matrix, benchmark corpus, and precision requirements.

## Context to inspect
Inspect generated vector instructions, alignment/layout, autovectorization reports, feature detection, fallback path, and runtime architecture.

## Core knowledge
SIMD can improve throughput when operations are data parallel and memory access is efficient. Autovectorizers depend on aliasing/control flow. Vector semantics and floating-point behavior must satisfy application tolerance.

## Procedure
1. Prove the scalar path is a material bottleneck.
2. Establish correctness and performance baselines.
3. Improve data layout and loop structure for vectorization.
4. Try compiler autovectorization before intrinsics.
5. Inspect generated Wasm for expected SIMD operations.
6. Add explicit intrinsics only where needed.
7. Preserve a compatible fallback when support matrix requires it.
8. Benchmark multiple realistic sizes.
9. Test edge lengths, alignment, NaN/overflow, and precision cases.
10. Measure end-to-end impact, not kernel speed alone.

## Decision points
Prefer autovectorization for maintainability; intrinsics for proven critical kernels. Keep scalar fallback if unsupported runtimes remain contractual targets.

## Common failure patterns
Vectorizing cold code; benchmark-only aligned inputs; tail bugs; precision drift; assuming SIMD guarantees speedup; increasing code size enough to hurt startup.

## Verification
Compare scalar/SIMD outputs across corpus, run runtime matrix, inspect generated instructions, and report statistically meaningful benchmarks.

## Expected output
A verified SIMD optimization with documented feature requirements, fallback behavior, and measured end-to-end gain.

## Stop conditions
Stop if correctness tolerance is undefined, runtime support is insufficient, or gains are within noise/offset by startup or size regressions.