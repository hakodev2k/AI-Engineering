# Load Balancing and Capacity Planning

## Purpose
Distribute AI traffic across eligible deployments while maintaining throughput, latency SLOs, fault tolerance, and cost efficiency under changing demand.

## When to use
Use for self-hosted inference, provisioned endpoints, multi-deployment providers, or any routing layer with meaningful capacity limits.

## Inputs
Traffic forecasts, concurrency, token distributions, decode throughput, GPU/endpoint capacity, quotas, latency SLOs, scaling behavior, and failure domains.

## Preconditions
Capacity measurements must reflect realistic context length, output length, batching, and concurrency rather than isolated synthetic throughput numbers.

## Context to inspect
Deployment topology, autoscaling, queueing, batch scheduler, provider quotas, GPU utilization, regional traffic, health checks, and historical peaks.

## Core knowledge
AI capacity is workload-sensitive. Requests with long prefills and long decodes consume resources differently. Simple request-count balancing can overload a route even when counts appear equal. Queueing delay often dominates before compute reaches nominal maximum utilization.

## Procedure
1. Segment traffic by resource intensity.
2. Measure per-deployment throughput and latency curves.
3. Identify safe operating utilization before queue latency rises sharply.
4. Define capacity units using tokens, concurrency, or measured service time.
5. Reserve headroom for failures and bursts.
6. Choose balancing weights from available capacity, not static percentages alone.
7. Account for warm-up and scale-out delay.
8. Test single-deployment and regional failure scenarios.
9. Forecast growth and provider quota needs.
10. Monitor saturation, queue depth, rejection, and spillover routes.

## Decision points
Scale out when workload parallelism and architecture support it; scale up when model memory or single-request performance requires larger hardware. Prefer admission control over extreme queueing near saturation.

## Common failure patterns
Balancing by request count only, planning from average traffic, no failure headroom, assuming autoscaling is instantaneous, and using GPU utilization alone as the capacity signal.

## Verification
Load tests reproduce expected traffic mix and show SLO compliance at target utilization plus documented failure headroom.

## Expected output
A capacity model, balancing policy, saturation thresholds, scaling triggers, and forecast.

## Stop conditions
Stop if throughput measurements are not representative or required capacity cannot be secured within SLO and budget constraints.