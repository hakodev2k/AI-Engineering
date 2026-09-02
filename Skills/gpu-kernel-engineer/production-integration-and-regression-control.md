# Production Integration and Regression Control

## Purpose
Integrate optimized GPU kernels into production systems with safe dispatch, fallback behavior, observability, compatibility controls, and regression protection.

## When to use
Use when promoting a custom kernel from experimentation into a library, service, ML runtime, simulation stack, or other production workload.

## Inputs
Kernel variants, supported GPU/runtime matrix, performance targets, correctness suite, fallback implementation, packaging/build system, and operational requirements.

## Context to inspect
Runtime capability detection, ABI/API contracts, stream semantics, memory ownership, allocator integration, error propagation, compilation/JIT behavior, caching, deployment environment, and monitoring.

## Core knowledge
Production kernel engineering extends beyond isolated device code. Dispatch bugs, driver incompatibilities, hidden synchronization, JIT latency, workspace growth, and weak fallback logic can outweigh microbenchmark gains. Safe integration requires explicit capability gates and reproducible regression baselines.

## Procedure
1. Define supported architectures, drivers/runtimes, shapes, data types, and numerical tolerances.
2. Establish a trusted fallback path before enabling the optimized kernel.
3. Implement capability- and shape-aware dispatch with explicit unsupported-case handling.
4. Preserve stream ordering, memory lifetime, and error propagation contracts.
5. Account for JIT/compilation and workspace behavior in deployment latency and memory budgets.
6. Add correctness and performance tests to CI for available hardware tiers.
7. Define performance regression thresholds using stable representative benchmarks.
8. Record kernel variant, architecture, runtime, and failure metadata for diagnosis without leaking sensitive data.
9. Roll out progressively when production impact is material.
10. Compare end-to-end latency, throughput, memory use, and error rates against the fallback.
11. Keep rollback simple and test it before broad deployment.

## Decision points
Use runtime specialization when workload diversity justifies it; prefer fewer variants when operational complexity exceeds performance benefit. Fail over to a proven implementation when capability checks or validation fail.

## Common failure patterns
No fallback; dispatching unsupported shapes; hidden device synchronization; benchmarking only kernel time while production is launch/JIT bound; silent numerical drift; and relying on one driver version.

## Verification
Run the full correctness matrix, compatibility tests, performance gates, fallback tests, and representative end-to-end workloads. Verify observable production metrics remain within defined thresholds.

## Expected output
A production-ready integration plan with safe dispatch, rollback, compatibility boundaries, and regression evidence.

## Stop conditions
Stop when fallback behavior is absent, target compatibility cannot be tested, or deployment requires breaking an established API/ABI or numerical contract without approval.