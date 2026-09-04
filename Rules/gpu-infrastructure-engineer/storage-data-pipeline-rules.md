# GPU Storage and Data Pipeline Rules

## Purpose
Ensure storage and data delivery sustain accelerator workloads without corrupting data, hiding bottlenecks, or destabilizing shared systems.

## Scope
Applies to training datasets, model artifacts, checkpoints, caches, local scratch, shared filesystems, object storage, and data-loading pipelines.

## MUST
- Storage architecture MUST be sized using measured throughput, IOPS, metadata load, dataset size, checkpoint behavior, and concurrency.
- Critical datasets and checkpoints MUST have defined durability, integrity, retention, and recovery expectations.
- Data paths MUST preserve authorization and tenant boundaries from source through local cache.
- Storage bottlenecks MUST be distinguished from GPU compute bottlenecks using telemetry.
- Checkpoint and artifact writes MUST be validated for completeness before older recoverable state is removed.

## MUST NOT
- Local ephemeral storage MUST NOT be treated as durable unless the platform explicitly guarantees it.
- Shared storage MUST NOT be stress-tested in production without bounded blast radius.
- Cache invalidation MUST NOT silently serve data outside its authorized scope.

## SHOULD
- Pipelines SHOULD prefetch or cache where measurement shows accelerator starvation and consistency requirements permit it.
- Large jobs SHOULD avoid synchronized I/O patterns that overload shared services when staggering is feasible.

## Exceptions
Exceptions require documented durability, consistency, security, and recovery risk.

## Verification
Inspect storage telemetry, data-loader traces, integrity checks, recovery tests, authorization tests, and representative checkpoint benchmarks.