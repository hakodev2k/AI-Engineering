# Batch Processing Platform

## Purpose
Engineer dependable batch-processing capabilities for large-scale transformations with predictable scheduling, resource use, recovery, and reproducibility.

## When to use
Use for ETL/ELT, periodic aggregates, backfills, or compute-heavy transformations that do not require continuous processing.

## Inputs
Transformation DAGs, data volumes, deadlines, dependencies, compute engines, historical runtimes, and resource budgets.

## Context to inspect
Scheduler configuration, cluster/runtime settings, partitioning, shuffle behavior, retries, checkpoints, backfill procedures, and job telemetry.

## Core knowledge
Batch systems trade latency for throughput and efficiency. Correctness requires deterministic inputs, bounded side effects, idempotent reruns, explicit dependencies, and stable resource isolation.

## Procedure
1. Define completion SLO and data dependencies.
2. Identify deterministic boundaries and side effects.
3. Partition work to expose parallelism without pathological skew.
4. Size CPU, memory, local disk, and network from measurements.
5. Design intermediate persistence only where recovery benefit justifies cost.
6. Make writes atomic or idempotent.
7. Configure bounded retries by failure class.
8. Separate routine schedules from backfill capacity where needed.
9. Emit job, stage, data-quality, and freshness metrics.
10. Test retries, partial failures, skew, late inputs, and backfills.
11. Tune from profiles rather than configuration folklore.

## Decision points
Use distributed compute only when data size or runtime requires it. Prefer incremental processing when recomputation cost is high and change semantics are reliable. Cache intermediate data only when reuse outweighs memory/storage pressure.

## Common failure patterns
Blind retries, oversized partitions, data skew, non-idempotent outputs, scheduler stampedes, hidden cross-job dependencies, backfills starving production, and tuning without profiles.

## Verification
Re-run identical inputs and compare outputs; simulate worker loss; benchmark deadline headroom; inspect spill/shuffle; execute a representative backfill without violating production SLOs.

## Expected output
Reliable batch jobs, resource profiles, retry/recovery policy, backfill procedure, dashboards, and runbooks.

## Stop conditions
Stop when source snapshots are not reproducible, writes cannot be made safely repeatable, or required backfill capacity threatens production workloads without approval.