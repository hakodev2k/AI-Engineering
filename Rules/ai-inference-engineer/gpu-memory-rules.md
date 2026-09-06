# GPU and Accelerator Memory Rules

## Purpose
Prevent out-of-memory failures, fragmentation, and unsafe memory pressure during inference.

## Scope
Model weights, KV cache, activation buffers, workspaces, memory pools, fragmentation, and device allocation.

## MUST
- Production deployments MUST define expected steady-state and peak device-memory usage for representative workloads.
- Capacity calculations MUST include model weights, runtime workspaces, caches, batching overhead, and fragmentation headroom.
- Memory admission limits MUST prevent predictable device OOM under supported request bounds.
- Memory regressions MUST be measured on target accelerator classes.
- OOM handling MUST produce actionable telemetry and preserve service recoverability.

## MUST NOT
- MUST NOT rely on allocator failure as the normal request admission mechanism.
- MUST NOT assume free-memory snapshots represent sustainable capacity under concurrent load.
- MUST NOT increase batch size or context limits without validating peak memory behavior.

## SHOULD
- Track allocated, reserved, fragmented, and cache memory separately where the runtime exposes them.
- Prefer bounded cache policies over unbounded growth.

## Exceptions
Reduced memory headroom requires measured evidence, operational safeguards, and approval.

## Verification
Inspect memory profiles, stress tests, OOM tests, allocator telemetry, and deployment limits.