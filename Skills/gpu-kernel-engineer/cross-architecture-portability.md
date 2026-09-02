# Cross-Architecture Portability

## Purpose
Design GPU kernels that preserve correctness and acceptable performance across multiple GPU generations, vendors, subgroup widths, and compiler toolchains.

## When to use
Use for products deployed across heterogeneous accelerators, when adding a new GPU backend, or when architecture-specific tuning has accumulated.

## Inputs
Supported GPU fleet, programming models, kernel source, feature requirements, compiler matrix, benchmarks, and numerical contracts.

## Context to inspect
Subgroup width, shared-memory limits, register limits, atomic support, matrix instructions, memory model, synchronization primitives, data-type support, and compiler extensions.

## Core knowledge
Portable correctness and portable peak performance are different goals. Senior engineering isolates architecture-specific assumptions, provides capability detection and fallback paths, and avoids accidental dependence on warp width, bank layout, or undocumented compiler behavior.

## Procedure
1. Enumerate supported architectures and required minimum capabilities.
2. Identify source assumptions tied to one vendor or generation.
3. Separate portable algorithm structure from architecture-specific tuning.
4. Replace implicit subgroup-size assumptions with explicit abstractions or guarded specializations.
5. Provide fallback implementations for optional instructions or precisions.
6. Centralize launch/tile parameters rather than scattering constants.
7. Test compilation and correctness across the support matrix.
8. Benchmark representative shapes on each architecture.
9. Use specialization only where measured gains justify added complexity.
10. Document unsupported combinations and capability checks.

## Decision points
Prefer one portable kernel when performance remains acceptable. Maintain specialized variants when an important target requires materially different tiling, subgroup, matrix, or memory behavior.

## Common failure patterns
Assuming warp size 32 universally; hard-coding shared-memory limits; using vendor intrinsics without fallback; interpreting compiler extensions as standard behavior; and validating only the fastest GPU.

## Verification
Run correctness, numerical, and benchmark suites across the supported hardware/compiler matrix and verify runtime dispatch selects compatible variants.

## Expected output
A capability-aware kernel strategy with explicit portability boundaries and validated fallback paths.

## Stop conditions
Stop when required hardware is unavailable for validation or a target lacks primitives needed to satisfy correctness semantics.