# Capacity and Performance Rules

## Purpose
Ensure distributed systems meet latency, throughput, and scaling objectives with measured headroom.

## Scope
Critical request paths, storage, messaging, replicas, partitions, and shared dependencies.

## MUST
- Performance claims MUST be supported by representative measurements.
- Capacity plans MUST identify expected load, bottlenecks, saturation signals, and scaling thresholds.
- Tail latency and dependency fan-out MUST be evaluated for critical paths.
- Scaling changes MUST account for downstream capacity and coordination overhead.

## MUST NOT
- MUST NOT optimize based solely on average latency when tail behavior affects objectives.
- MUST NOT assume horizontal scaling removes database, network, or coordination bottlenecks.

## SHOULD
- Maintain tested headroom for expected bursts and failure-induced load shifts.

## Exceptions
Operating with reduced headroom requires explicit risk acceptance and monitoring.

## Verification
Review load tests, percentile latency, saturation metrics, bottleneck evidence, scaling tests, and capacity forecasts.