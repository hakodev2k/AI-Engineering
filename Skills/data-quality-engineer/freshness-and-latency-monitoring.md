# Freshness and Latency Monitoring

## Purpose
Detect when data arrives, processes, or becomes queryable later than consumers can tolerate.

## When to use
Use for scheduled pipelines, streams, operational replicas, dashboards, ML features, and SLA-sensitive data products.

## Inputs
Expected arrival cadence, event timestamps, ingestion timestamps, processing checkpoints, consumer SLOs, and historical latency.

## Preconditions
Clarify event time, processing time, timezone, and legitimate late-arrival behavior.

## Context to inspect
Review schedules, queues, watermarking, retries, dependencies, partition publication, upstream SLAs, and consumer query patterns.

## Core knowledge
Freshness is not equivalent to job success. End-to-end latency includes production, transport, processing, publication, and consumer availability. Seasonality and late events require explicit policy.

## Procedure
1. Define consumer-visible freshness SLO.
2. Identify authoritative timestamps and checkpoints.
3. Measure end-to-end and stage latency.
4. Establish baselines by cadence and partition.
5. Define warning and breach thresholds.
6. Instrument missing-partition and stalled-watermark detection.
7. Correlate freshness with upstream dependencies.
8. Route alerts to accountable owners with context.
9. Test delayed and missing-data scenarios.
10. Review false positives and adjust only with evidence.

## Decision points
Use static thresholds for stable schedules and dynamic baselines for variable workloads. Alert on consumer impact rather than every internal delay. Separate late-but-valid data from permanently missing data.

## Common failure patterns
Monitoring job completion only; comparing timestamps in inconsistent zones; thresholds tighter than source capability; alerting every partition independently; masking persistent lateness by continuously widening thresholds.

## Verification
Inject or simulate delayed arrivals, confirm detection before SLO breach where feasible, and verify recovery clears alerts only when consumer-visible freshness is restored.

## Expected output
Freshness indicators, stage latency metrics, SLO thresholds, alerts, ownership, and tested response behavior.

## Stop conditions
Stop when timestamp semantics are unreliable, source cadence is undocumented, or monitoring would expose sensitive payloads unnecessarily.