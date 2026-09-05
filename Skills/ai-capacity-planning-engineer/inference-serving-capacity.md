# Inference Serving Capacity

## Purpose
Size online inference fleets to meet throughput and tail-latency objectives under realistic token and concurrency distributions.

## When to use
Use for new model serving, growth planning, SLO violations, or hardware migration.

## Inputs
Traffic traces, token distributions, concurrency, latency SLOs, model benchmarks, GPU types, batching and routing configuration.

## Preconditions
Representative production-like load can be replayed safely.

## Context to inspect
Inference engine, batch scheduler, KV cache, autoscaling, model replicas, routing, retries, streaming, rate limits.

## Core knowledge
Serving capacity must be measured at sustainable p95/p99 latency, not maximum benchmark throughput. Prefill-heavy and decode-heavy workloads stress systems differently.

## Procedure
1. Segment traffic by model and token profile.
2. Measure single-replica throughput and latency curves.
3. Find the saturation knee.
4. Choose a safe target utilization below that knee.
5. Include retry and failover overhead.
6. Size replicas per region.
7. Validate batching and concurrency assumptions.
8. Load-test peak scenarios.
9. Document scaling thresholds and reserve margin.

## Decision points
Prefer more replicas over higher per-replica utilization when tail latency is strict. Use separate pools for incompatible SLO or model profiles.

## Common failure patterns
Sizing from average latency, ignoring context growth, assuming ideal batching, and omitting failure reserve.

## Verification
Peak load tests meet throughput and p95/p99 latency while one failure domain is unavailable.

## Expected output
Replica and accelerator requirements by model, region, and demand scenario.

## Stop conditions
Escalate when benchmark behavior differs materially from production traces.