# Fleet-Scale Load Testing

## Purpose
Validate cloud, broker, network, and operational behavior under realistic fleet concurrency and reconnect patterns.

## When to use
Use before major launches, fleet growth, protocol changes, or capacity-sensitive releases.

## Inputs
Fleet size, message rates, payloads, connection patterns, regional distribution, backend limits.

## Context to inspect
Brokers, ingestion, databases, queues, throttles, quotas, autoscaling, dashboards, and device retry logic.

## Core knowledge
IoT load is often bursty: power restoration, network recovery, scheduled reporting, and OTA can synchronize huge populations. Average throughput is insufficient for capacity planning.

## Procedure
1. Model steady-state and burst traffic separately.
2. Include connection establishment and authentication cost.
3. Simulate realistic payloads and topic/device cardinality.
4. Model reconnect storms and backoff behavior.
5. Exercise OTA/config campaigns alongside telemetry.
6. Measure latency, errors, throttling, queue depth and cost.
7. Identify saturation and recovery behavior.
8. Tune quotas, scaling and client backoff.
9. Repeat beyond expected peak with safety margin.

## Decision points
Scale infrastructure when bottlenecks are resource-bound; reshape traffic when synchronization or retry behavior creates avoidable peaks.

## Common failure patterns
Testing only average RPS, unrealistic virtual clients, ignoring TLS/authentication, and no recovery measurement after overload.

## Verification
Demonstrate target SLOs at expected peak and controlled degradation/recovery beyond it.

## Expected output
Capacity evidence, bottlenecks, limits, and scaling/retry recommendations.

## Stop conditions
Stop destructive load against production unless explicitly authorized and isolated.