# Streaming Capacity Planning

## Purpose
Translate workload forecasts and SLOs into broker, partition, compute, storage, and network capacity with headroom.

## When to use
Use before launches, growth events, topology changes, or recurring saturation.

## Inputs
Peak/average events per second, bytes per event, retention, replication, processing cost, growth forecast, RTO/RPO.

## Context to inspect
Current utilization, partition limits, broker disk/network, consumer service rate, quotas, autoscaling behavior.

## Core knowledge
Capacity must account for peaks, replication, retention, replay, failure-domain loss, compaction, checkpoints, and backlog drain—not only steady-state ingress.

## Procedure
1. Measure current workload distributions.
2. Forecast peak event and byte rates.
3. Calculate retention/storage with replication.
4. Determine partitions from throughput and parallelism constraints.
5. Model processor and sink service rates.
6. Reserve failure and replay headroom.
7. Define autoscaling and hard limits.
8. Load-test forecast scenarios.
9. Document assumptions and review triggers.

## Decision points
Scale partitions/compute when parallelism is limiting; scale broker resources when disk/network is limiting; reduce retention only when governance permits.

## Common failure patterns
Sizing on averages; no failure headroom; ignoring replay traffic; assuming autoscaling is instantaneous; forgetting downstream quotas.

## Verification
Capacity tests sustain forecast peak plus agreed headroom while meeting SLOs and recovery targets.

## Expected output
Capacity model, limits, headroom, scaling triggers, and test evidence.

## Stop conditions
Stop when growth, retention, or SLO assumptions are unavailable or contradictory.