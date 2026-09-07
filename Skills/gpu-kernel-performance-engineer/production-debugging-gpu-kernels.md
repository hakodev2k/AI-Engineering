# Production Debugging for GPU Kernels

## Purpose
Diagnose GPU kernel failures and performance anomalies in production-like environments where symptoms may include illegal memory access, hangs, device resets, NaNs, sporadic corruption, or sudden latency spikes.

## When to use
Use when a kernel fails outside local tests, behavior is nondeterministic, a deployment introduces GPU-specific incidents, or performance collapses only under realistic concurrency or shapes.

## Inputs
Incident timeline, failing inputs, logs, driver/runtime versions, GPU model, kernel build identifiers, profiler or crash reports, error codes, deployment diff, resource telemetry.

## Preconditions
Preserve evidence before restarting or changing the environment when feasible. Establish whether data sensitivity permits capturing failing inputs.

## Context to inspect
Inspect asynchronous error reporting, previous kernel failures, bounds checks, pointer lifetimes, stream ordering, race conditions, launch parameters, OOM state, device health, ECC/Xid-style errors where available, driver changes, thermal/power state, and workload shape.

## Core knowledge
GPU errors often surface later than the operation that caused them because execution is asynchronous. A synchronization added for diagnosis can change timing and mask races, so use it deliberately. Device-level faults, memory exhaustion, and kernel bugs require different escalation paths.

## Procedure
1. Correlate the first observed failure with recent deployments and device/runtime changes.
2. Capture the exact device, driver, runtime, kernel build, launch shape, and input dimensions.
3. Reproduce with the smallest failing workload if possible.
4. Add scoped synchronization or error checks to localize the failing launch.
5. Run memory/race sanitizers in a non-production environment where available.
6. Check pointer ranges, lifetimes, alignment, indexing, and boundary masks.
7. Inspect stream/event ordering and asynchronous frees.
8. Separate correctness faults from device-health or capacity faults using telemetry and known-good kernels.
9. Compare optimized and debug/safe variants only after preserving the failure signature.
10. Validate the fix under concurrency, long-running stress, and representative device diversity.

## Decision points
Roll back quickly when a new release strongly correlates with severe faults. Escalate to infrastructure when independent kernels fail on the same device. Use deterministic debug modes temporarily when they aid localization, but do not treat them as performance evidence.

## Common failure patterns
Blaming the kernel that reports the error rather than the earlier asynchronous fault; reproducing only on one GPU; ignoring allocator lifetime races; adding global synchronization permanently; losing evidence through automatic restart loops; treating all NaNs as hardware faults.

## Verification
Confirm the original failure no longer reproduces across stress runs, sanitizers report clean results where applicable, performance remains within budget, and telemetry shows no new device-level error pattern.

## Expected output
A root-cause narrative, minimal reproducer or evidence set, corrective change, and production-safe verification plan.

## Stop conditions
Escalate immediately for repeated device resets, hardware/ECC faults, inaccessible production evidence, or a suspected driver/runtime defect that cannot be isolated safely in application code.