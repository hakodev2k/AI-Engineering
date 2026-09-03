# Throughput and Capacity Planning

## Purpose
Estimate and validate serving capacity so deployments meet forecast demand with explicit headroom, cost, and degradation behavior.

## When to use
Use for launch planning, hardware sizing, regional expansion, model upgrades, or recurring saturation incidents.

## Inputs
Traffic forecasts, concurrency, token-length distributions, service-time measurements, accelerator counts, utilization limits, availability targets, and cost constraints.

## Context to inspect
Inspect request arrival patterns, burstiness, batch efficiency, queue limits, autoscaling lag, hardware failure domains, and regional traffic routing.

## Core knowledge
Requests per second alone is insufficient for generative workloads; token throughput, prompt length, output length, and active sequences drive capacity. Sustainable capacity must be below unstable saturation.

## Procedure
1. Define demand in requests and tokens over time.
2. Segment workloads by length and priority.
3. Benchmark one replica at increasing concurrency.
4. Identify the knee where tail latency accelerates.
5. Establish safe per-replica capacity below that point.
6. Add redundancy and burst headroom.
7. Model autoscaling delay and cold-start cost.
8. Validate zone or node failure scenarios.
9. Run load tests at forecast and overload levels.
10. Publish capacity thresholds and expansion triggers.

## Decision points
Use fixed warm capacity when cold starts violate SLOs. Use elastic capacity for predictable variable load when spin-up time is acceptable. Reserve separate pools when one workload class can starve another.

## Common failure patterns
Sizing by peak GPU utilization, ignoring burstiness, counting theoretical FLOPS as service capacity, no failure headroom, and using one average token length.

## Verification
Verified capacity requires a repeatable load test showing target SLOs, stable queues, and acceptable utilization at planned demand plus agreed headroom.

## Expected output
Capacity model, safe per-replica throughput, headroom policy, scaling thresholds, and overload results.

## Stop conditions
Escalate when traffic forecasts or production-like workload distributions are unavailable or hardware quotas cannot satisfy minimum redundancy.