# GPU Memory Rules

## Purpose
Prevent memory exhaustion, fragmentation, and unsafe overcommit in accelerator-backed serving.

## Scope
Applies to model weights, KV cache, activations, runtime workspaces, adapters, and allocator behavior.

## MUST
- Measure steady-state and peak accelerator memory under representative workloads.
- Reserve memory headroom for runtime variance and operational events.
- Bound sequence length, concurrency, and cache growth against verified memory capacity.
- Treat OOM events as production reliability failures requiring root-cause analysis.

## MUST NOT
- Depend on undocumented allocator behavior for safety.
- Increase utilization targets without validating peak memory behavior.
- Mask recurring OOM failures with blind process restarts alone.

## SHOULD
- Track fragmentation and cache pressure when the runtime exposes them.
- Prefer explicit memory budgets per replica or workload class.

## Exceptions
Higher-risk memory targets require benchmark evidence, alerting, rollback thresholds, and approval.

## Verification
Use runtime memory metrics, stress tests, long-duration load tests, OOM logs, and configuration inspection.