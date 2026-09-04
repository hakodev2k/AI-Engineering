# GPU Memory and Resource Rules

## Purpose
Prevent memory fragmentation, oversubscription, and resource imbalance from causing unstable or inefficient accelerator workloads.

## Scope
Applies to device memory, host memory, pinned memory, unified-memory behavior, shared-memory resources, and workload resource declarations.

## MUST
- Workload sizing MUST account for peak device-memory demand, framework overhead, communication buffers, and material host-memory requirements.
- Out-of-memory failures MUST be investigated with allocation and workload evidence before platform-wide limits are changed.
- Shared-resource policies MUST define whether oversubscription is supported and how contention is controlled.
- Memory-related tuning MUST be validated for correctness and workload stability under representative concurrency.
- Resource pressure that can destabilize the host MUST be observable and bounded.

## MUST NOT
- Repeated out-of-memory failures MUST NOT be masked by unlimited retries.
- Device-memory capacity MUST NOT be inferred from accelerator count alone when models differ.
- Host memory, shared memory, or pinned-memory consumption MUST NOT be ignored when diagnosing GPU starvation or node instability.

## SHOULD
- Workloads SHOULD reserve realistic resources based on measured peaks plus justified headroom.
- Memory optimizations SHOULD be evaluated against throughput, latency, and recomputation cost.

## Exceptions
Exceptions require measured evidence, risk, bounded scope, and an owner.

## Verification
Inspect memory telemetry, profiler output, OOM events, workload requests, concurrency tests, and host-pressure metrics.