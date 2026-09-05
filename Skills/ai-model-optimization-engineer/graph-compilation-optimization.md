# Graph Compilation Optimization

## Purpose
Use graph capture, compilation, fusion, and specialization to reduce runtime overhead and improve accelerator efficiency.

## When to use
When framework overhead, graph breaks, launch overhead, or unfused operators materially affect inference.

## Inputs
Model code, compiler/runtime, profiles, representative shapes, target hardware, baseline metrics.

## Preconditions
Have correctness tests and an eager/reference execution path.

## Context to inspect
Inspect dynamic control flow, unsupported operators, graph breaks, shape polymorphism, compilation cache, generated kernels, and fallback behavior.

## Core knowledge
Compilation can trade startup time and artifact complexity for steady-state gains. Excessive shape specialization causes recompilation; graph transformations can expose numerical differences.

## Procedure
1. Profile eager execution.
2. Capture/compile the smallest representative path.
3. Inspect graph breaks and fallbacks.
4. Remove avoidable dynamic behavior without changing semantics.
5. Enable supported fusion and layout transformations.
6. Define realistic shape buckets or dynamic-shape policy.
7. Measure compile time and steady-state performance separately.
8. Run numerical and task-level equivalence tests.
9. Stress cache behavior across production shapes.
10. Package a known-good fallback.

## Decision points
Prefer compilation when steady-state savings exceed startup/cache costs. Keep eager execution when workload variability or unsupported operations erase gains.

## Common failure patterns
Benchmarking after compilation without counting cold starts, accidental recompilation, silent fallback, over-specializing shapes, and skipping numerical checks.

## Verification
Compiled execution meets correctness tolerances and improves target end-to-end metrics under realistic shape diversity.

## Expected output
Compiled artifact/configuration, graph-break analysis, shape policy, benchmarks, and fallback plan.

## Stop conditions
Stop if correctness diverges, compilation is unstable, unsupported operators dominate, or operational complexity exceeds measured benefit.