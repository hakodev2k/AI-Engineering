# Capacity Planning

## Purpose
Forecast compute, memory, storage, I/O, and network capacity for vector workloads with growth and failure headroom.

## When to use
Use before launches, model/index changes, large backfills, or scaling decisions.

## Inputs
Vector count/dimension/type, index overhead, payload size, QPS, concurrency, growth, replication, build/backfill load, SLO, and retention.

## Context to inspect
Inspect current utilization, index size, memory residency, ingestion rate, query mix, replicas/shards, compaction, backups, and failure-domain requirements.

## Core knowledge
Raw vector bytes are only part of footprint; ANN graphs/centroids, metadata, payloads, WAL, replicas, temporary rebuild space, and filesystem overhead matter. Capacity must cover peak load and degraded operation, not average steady state.

## Procedure
1. Measure current per-vector storage and index overhead empirically.
2. Forecast corpus and metadata growth by horizon.
3. Model query and ingestion peaks separately and concurrently.
4. Include replication, backups, rebuild/compaction temporary space.
5. Determine working-set memory and I/O behavior.
6. Benchmark per-node sustainable QPS before saturation.
7. Reserve headroom for node loss and traffic bursts.
8. Estimate embedding/backfill demand for migrations.
9. Define scaling thresholds and lead times.
10. Reconcile forecast against cloud/on-prem quotas and budget.

## Decision points
Add shards when dataset/workload exceeds a failure-safe node envelope; add replicas primarily for read capacity/availability. Compression/quantization can reduce footprint but requires quality validation.

## Common failure patterns
Using raw-vector size as total storage; no rebuild headroom; capacity based on averages; ignoring replicas; assuming linear scaling; missing provider quotas; planning queries and backfills independently.

## Verification
Compare model predictions with load tests and historical utilization; simulate a node/failure-domain loss and verify remaining capacity meets defined degraded SLO.

## Expected output
A capacity model, growth forecast, scaling triggers, quotas, cost estimate, and risk margins.

## Stop conditions
Stop if workload/growth inputs are materially unknown or planned tests could destabilize production.