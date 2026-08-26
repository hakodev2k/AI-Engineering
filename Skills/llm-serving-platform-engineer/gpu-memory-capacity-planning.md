# GPU Memory Capacity Planning

## Purpose
Build an evidence-based accelerator-memory budget that prevents OOMs while maximizing safe concurrency.

## When to use
Use during model onboarding, context-window changes, concurrency increases, runtime upgrades, or OOM investigation.

## Inputs
Weight size, precision, KV-cache formula, context distributions, concurrency, runtime overhead, hardware memory.

## Context to inspect
Actual allocator telemetry, graphs, workspaces, temporary buffers, fragmentation, model replicas, and runtime reservations.

## Core knowledge
Memory includes weights, KV cache, activations/workspaces, CUDA graphs, runtime state, communication buffers, and fragmentation. Peak memory, not steady-state average, determines safety.

## Procedure
1. Inventory every persistent allocation. 2. Calculate theoretical weight and KV footprints. 3. Measure runtime baseline after warmup. 4. Measure incremental memory across contexts and concurrency. 5. Identify transient peaks. 6. Reserve explicit safety headroom. 7. Derive admission limits by workload class. 8. Stress cancellation, long context, batch transitions, and reloads. 9. Alert before hard exhaustion. 10. Revalidate after runtime/model changes.

## Decision points
Reduce concurrency or context before relying on allocator luck. Increase headroom for heterogeneous workloads and runtimes with variable workspaces.

## Common failure patterns
Using model file size as weight memory, ignoring fragmentation and graphs, sizing from averages, permitting unlimited long contexts, and assuming warmup peak equals production peak.

## Verification
Reconcile calculated and measured memory, then demonstrate no OOM under defined worst-case representative scenarios.

## Expected output
A memory budget, safe concurrency/context envelope, admission limits, and alert thresholds.

## Stop conditions
Stop if runtime memory cannot be instrumented, workload bounds are unknown, or tests cannot safely reproduce peak conditions.