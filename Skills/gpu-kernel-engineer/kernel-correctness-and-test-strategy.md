# Kernel Correctness and Test Strategy

## Purpose
Build a verification strategy that catches indexing, boundary, synchronization, numerical, and architecture-specific defects in GPU kernels before performance tuning or release.

## When to use
Use for every new kernel, major optimization, backend port, precision change, or production regression.

## Inputs
Kernel contract, CPU or trusted reference implementation, supported shapes and data types, tolerances, target hardware matrix, and known edge cases.

## Context to inspect
Shape constraints, aliasing rules, alignment, empty inputs, odd dimensions, overflow, NaN/Inf handling, determinism requirements, race risks, and supported architectures.

## Core knowledge
A fast kernel with incomplete correctness coverage is a production liability. GPU tests must cover both semantic outputs and execution hazards. Numerical comparisons require domain-appropriate tolerances rather than blanket exact equality or permissive thresholds.

## Procedure
1. Define the kernel contract and invalid-input behavior.
2. Establish a simple trusted reference implementation.
3. Create deterministic unit cases for boundaries and known tricky shapes.
4. Add randomized differential tests across dimensions, strides, values, and data types.
5. Include zero, one, non-multiple tile sizes, large sizes, and misalignment where supported.
6. Test NaN, Inf, extreme magnitudes, and cancellation-sensitive values when relevant.
7. Run race/memory sanitizers on representative cases.
8. Test repeated runs when determinism is required.
9. Execute the suite across supported GPU/compiler variants.
10. Add every discovered defect as a regression case.

## Decision points
Use exact comparison for integer and deterministic exact semantics; use justified absolute/relative/ULP or application-level tolerance for floating-point kernels.

## Common failure patterns
Testing only happy-path shapes; using the optimized kernel as its own oracle; tolerances so loose they hide defects; skipping sanitizers; and validating only one GPU generation.

## Verification
The full correctness suite, sanitizer checks, and architecture matrix pass independently of performance benchmarks.

## Expected output
A reusable kernel test suite with reference results, explicit tolerances, and regression coverage.

## Stop conditions
Stop when expected semantics or numerical tolerances are undefined, or when required target hardware cannot be validated before release.