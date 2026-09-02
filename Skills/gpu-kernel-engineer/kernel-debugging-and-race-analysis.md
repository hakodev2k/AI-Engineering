# Kernel Debugging and Race Analysis

## Purpose
Diagnose incorrect GPU results, memory faults, races, deadlocks, and synchronization defects using a disciplined evidence-driven workflow.

## When to use
Use for intermittent wrong answers, illegal memory accesses, hangs, architecture-specific failures, or defects that disappear under instrumentation.

## Inputs
Failing kernel, reproducible input when available, CPU/reference result, sanitizer output, crash logs, launch parameters, and target GPU/runtime versions.

## Context to inspect
Index calculations, bounds, synchronization, shared-memory lifetime, active masks, atomic usage, aliasing, stream ordering, host-device lifetime, and error handling.

## Core knowledge
GPU bugs are often timing-sensitive and may be hidden by changed occupancy or instrumentation. Synchronization must match the memory scope of the data dependency. Device errors can surface asynchronously after the kernel that caused them.

## Procedure
1. Reduce the failure to the smallest reproducible workload.
2. Force synchronous error reporting during investigation where practical.
3. Check every launch and runtime error immediately.
4. Validate indexes and buffer extents independently of performance assumptions.
5. Run memory, race, and initialization checking tools available for the platform.
6. Inspect barriers for divergent participation and missing producer-consumer ordering.
7. Compare against a simple trusted reference.
8. Disable optimizations selectively to localize undefined behavior.
9. Vary block size and scheduling pressure to expose race sensitivity.
10. Fix the root cause, then restore asynchronous execution and performance settings.
11. Add a regression test that would fail without the fix.

## Decision points
Prefer a slower deterministic diagnostic path when it improves reproducibility. Do not mask a race with extra synchronization unless the dependency actually requires it.

## Common failure patterns
Ignoring asynchronous errors; debugging only optimized code; adding barriers blindly; relying on zero-initialized memory; incorrect active masks; and mistaking floating-point nondeterminism for a race without evidence.

## Verification
Run sanitizers, stress tests, multiple launch geometries, repeated executions, and the original failing case. Confirm no new synchronization regression.

## Expected output
A root-cause explanation, minimal fix, regression coverage, and evidence that the defect is eliminated.

## Stop conditions
Stop when reproducing the defect requires unavailable hardware/driver access or when the suspected fault lies in a third-party binary that cannot be inspected.