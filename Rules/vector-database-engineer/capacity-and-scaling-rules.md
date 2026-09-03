# Capacity and Scaling

## Purpose
Maintain retrieval SLOs as vectors, metadata, query volume, and rebuild demands grow.

## Scope
Applies to storage, memory, CPU/GPU, replicas, shards, partitions, autoscaling, and growth forecasting.

## MUST
- Capacity models MUST account for vector count, dimension, index overhead, metadata, replicas, compaction, backups, and rebuild headroom.
- Scaling thresholds MUST be tied to measured saturation indicators rather than resource utilization alone.
- Sharding or partitioning changes MUST evaluate recall, routing, hotspot, rebalance, and failure-domain effects.
- Production systems MUST retain enough headroom for expected traffic variance and maintenance operations.
- Growth forecasts MUST be revisited when ingestion rate or query shape materially changes.

## MUST NOT
- MUST NOT plan capacity from raw vector payload size alone.
- MUST NOT scale a bottlenecked tier without evidence that the added resource addresses the bottleneck.
- MUST NOT perform high-risk resharding without rollback/recovery planning and approval.

## SHOULD
- Capacity tests SHOULD measure behavior near saturation and during node loss.
- Per-tenant or per-workload attribution SHOULD identify noisy-neighbor growth.
- Scaling decisions SHOULD consider cost per successful retrieval objective.

## Exceptions
Exceptions require documented assumptions, risk, monitoring, recovery plan, and approval when reducing production safety margin.

## Verification
Inspect forecasts, load tests, index-size measurements, saturation curves, shard distributions, failover tests, and capacity dashboards.