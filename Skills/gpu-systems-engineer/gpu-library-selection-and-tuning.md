# GPU Library Selection and Tuning

## Purpose
Select and configure optimized GPU libraries before committing to custom implementations.

## When to use
Use for GEMM, convolution, FFT, sparse, solver, collective, codec, or other established accelerator primitives.

## Inputs
Operation semantics, shapes, datatypes, layouts, hardware, latency/throughput goals, workspace limits, determinism requirements.

## Preconditions
Define exact semantics and a correctness reference.

## Context to inspect
Inspect existing library calls, algorithm selection, workspace, math mode, layouts, batching, autotuning, handle/stream reuse, version compatibility, and fallback paths.

## Core knowledge
Vendor and ecosystem libraries encode architecture-specific kernels and dispatch heuristics. Their fastest algorithm can depend strongly on shape, precision, workspace, layout, determinism, and version. Autotuning itself has startup and reproducibility costs.

## Procedure
1. Map the operation to available maintained libraries.
2. Verify semantic, datatype, and layout compatibility.
3. Benchmark candidate APIs on representative shapes.
4. Enable supported accelerated math modes only after numerical review.
5. Evaluate workspace and memory implications.
6. Test autotuning/heuristics and cache decisions when appropriate.
7. Reuse handles/plans and avoid repeated initialization.
8. Check stream and concurrency semantics.
9. Validate across supported hardware/software versions.
10. Build a custom kernel only if a measured gap remains material.

## Decision points
Prefer libraries for standard primitives. Choose deterministic algorithms when required even if slower. Trade workspace for speed only within capacity/SLO constraints.

## Common failure patterns
Benchmarking one shape, recreating plans per request, layout conversions dominating gains, relying on undocumented algorithms, excessive workspace, silent precision changes, and custom kernels that lose on future architectures.

## Verification
Verify domain correctness, algorithm/workspace selection, warm and cold behavior, end-to-end performance, memory use, and supported-version behavior.

## Expected output
A justified library choice, configuration, benchmark matrix, and documented fallback/compatibility policy.

## Stop conditions
Stop when semantics are incompatible, licensing/support constraints prohibit the dependency, deterministic requirements cannot be met, or no representative hardware is available.