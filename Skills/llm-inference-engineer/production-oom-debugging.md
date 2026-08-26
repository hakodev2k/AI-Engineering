# Production OOM Debugging

## Purpose
Diagnose accelerator out-of-memory failures systematically and prevent recurrence without masking root causes.

## When to use
Use for CUDA OOMs, allocation failures, unexplained restarts, or capacity collapse at long contexts/high concurrency.

## Inputs
Error logs, memory metrics, request lengths, concurrency, runtime config, model revision, and recent changes.

## Context to inspect
Weight allocation, KV cache, temporary workspaces, allocator stats, fragmentation, CUDA graphs, parallelism, and request cleanup.

## Core knowledge
OOM can arise from deterministic sizing, workload spikes, fragmentation, leaks, temporary peak allocations, or configuration drift. Restarting clears symptoms but destroys evidence.

## Procedure
1. Capture timestamp, model/runtime version, GPU, request lengths, concurrency, and memory state.
2. Reconstruct recent deployment/config/traffic changes.
3. Separate static weight memory, cache occupancy, runtime overhead, and temporary peaks.
4. Check whether failed requests exceeded documented limits.
5. Reproduce with the smallest workload that triggers the failure.
6. Run repeated allocate/cancel cycles to detect leaks or fragmentation.
7. Test lower concurrency/context/cache limits to identify the controlling dimension.
8. Apply the narrowest fix and update admission/capacity guardrails.
9. Add regression tests and alerts before restoring full load.

## Decision points
Reduce cache/concurrency for immediate containment; change precision or add memory for structural capacity issues; upgrade/fix runtime for leaks.

## Common failure patterns
Blindly lowering batch size, relying on free-memory snapshots, infinite restarts, and failing to correlate OOM with active tokens.

## Verification
Sustain worst-case approved workload through repeated cycles with safety margin and no memory growth.

## Expected output
Root cause, containment, permanent remediation, and updated capacity limits.

## Stop conditions
Escalate when evidence indicates driver/hardware corruption or reproduction requires unsafe production experiments.