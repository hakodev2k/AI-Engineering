# Network Performance and Capacity Engineering

## Purpose
Measure and improve throughput, latency, jitter, loss, and capacity using workload evidence rather than intuition.

## When to use
Use for slow applications, saturated links, WAN planning, cloud egress constraints, growth forecasting, QoS review, or performance regressions.

## Inputs
Traffic baselines, interface counters, flow records, latency/loss measurements, application SLOs, topology, circuit rates, QoS policy, and growth forecasts.

## Context to inspect
Inspect utilization percentiles, microbursts, errors/discards, queue drops, duplex/speed, path changes, MTU, TCP behavior, provider limits, and application concurrency.

## Core knowledge
Average utilization hides bursts. Throughput depends on loss, RTT, congestion control, windowing, and application behavior. Capacity planning should account for failure-state load, not only normal operation.

## Procedure
1. Define performance objective and affected transaction.
2. Establish baseline across relevant time windows.
3. Measure latency, loss, jitter, and utilization per path segment.
4. Identify saturation, errors, queues, or protocol constraints.
5. Separate network delay from server/application delay.
6. Model peak and degraded-state demand.
7. Evaluate tuning, QoS, path, or capacity options.
8. Change one material variable at a time.
9. Benchmark before and after.
10. Set capacity thresholds and forecast review cadence.

## Decision points
Upgrade capacity when sustained demand and failure headroom justify it; use QoS when traffic classes have legitimate priority differences, not to hide chronic undersizing. Optimize path only when latency matters materially.

## Common failure patterns
Using averages only, testing with unrealistic tools, ignoring packet loss, assuming bandwidth equals throughput, oversubscribing failover paths, and applying QoS without classification evidence.

## Verification
Compare before/after percentiles under representative load, validate failure-state headroom, and confirm application-level improvement.

## Expected output
A measured performance diagnosis, capacity model, remediation, and validation evidence.

## Stop conditions
Escalate when provider capacity data is unavailable, load testing risks production, or application behavior prevents reliable network attribution.