# GPU Correctness, Race, and Memory Debugging

## Purpose
Diagnose GPU memory violations, races, synchronization defects, and device-side failures systematically.

## When to use
Use for illegal accesses, intermittent corruption, wrong results, hangs, device assertions, or failures that disappear under synchronization.

## Inputs
Failure reproduction, kernel source, launch parameters, logs, sanitizer output, hardware/software versions, correctness reference.

## Preconditions
Reduce destructive side effects and capture the first failing operation when possible.

## Context to inspect
Inspect bounds, pointer provenance, buffer lifetimes, stream ordering, barriers, atomics, shared memory, host-device ownership, asynchronous error reporting, and prior kernels.

## Core knowledge
GPU errors can surface later than their cause because launches are asynchronous. Race behavior is timing-sensitive. A synchronization added for debugging can mask the defect. Memory tools and deterministic minimal reproducers are high-value evidence.

## Procedure
1. Reproduce with a minimal representative case.
2. Force synchronization temporarily to localize asynchronous errors.
3. Check the earliest failing kernel/API.
4. Run memory/race/synchronization checking tools where available.
5. Validate all indices, extents, strides, and allocation sizes.
6. Trace buffer lifetime and ownership across streams.
7. Review barrier participation and atomic semantics.
8. Compare against a trusted reference.
9. Fix the smallest proven cause.
10. Remove diagnostic synchronization and stress repeatedly.
11. Add regression tests for boundary and concurrency cases.

## Decision points
Use deterministic debug modes to localize faults, but re-test asynchronous production behavior. Reduce optimization only as a diagnostic experiment, not a permanent fix without evidence.

## Common failure patterns
Blaming the kernel where an asynchronous error surfaced, tail-index overruns, stale pointers after allocator reuse, missing stream dependencies, divergent barriers, non-atomic updates, and debug waits that hide races.

## Verification
Require clean sanitizer runs where applicable, reference-correct outputs, repeated stress tests, no latent API errors, and tests on supported architectures.

## Expected output
A causal failure explanation, minimal fix, and regression coverage.

## Stop conditions
Stop when hardware errors are suspected, the failure cannot be reproduced or observed safely, symbols/source do not match the binary, or production access is required without authorization.