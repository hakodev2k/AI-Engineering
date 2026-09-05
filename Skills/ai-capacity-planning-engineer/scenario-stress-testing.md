# Capacity Scenario and Stress Testing

## Purpose
Validate capacity plans against realistic demand spikes, failures, model changes, and dependency degradation before production is exposed.

## When to use
Use before launches, seasonal peaks, regional failover events, model upgrades, or major capacity commitments.

## Inputs
Capacity model, demand scenarios, failure assumptions, SLOs, routing policies, autoscaling behavior, workload traces.

## Preconditions
A safe environment or controlled production test window exists.

## Context to inspect
Load generators, traffic replay, rate limits, failover, quotas, queueing, autoscaling, scheduler, model warm-up, monitoring.

## Core knowledge
A capacity plan is a hypothesis until tested. AI systems often fail nonlinearly near saturation through queue growth, memory pressure, batch inefficiency, retries, and tail-latency collapse.

## Procedure
1. Define normal, peak, burst, and failure scenarios.
2. Select representative workload traces.
3. Establish success thresholds for latency, throughput, errors, queues, and utilization.
4. Ramp load gradually to planned peaks.
5. Inject selected node, zone, provider, or storage failures.
6. Observe scaling and routing behavior.
7. Record saturation knees and recovery time.
8. Update the capacity model with measured limits.
9. Repeat after material remediation.

## Decision points
Use production shadow or limited canary tests when staging cannot reproduce real topology; protect users with strict abort thresholds.

## Common failure patterns
Testing only steady load, stopping before saturation, excluding retry traffic, and declaring success from average metrics.

## Verification
Measured system behavior matches or improves planning assumptions across all required scenarios.

## Expected output
A stress-test report with thresholds, observed limits, gaps, and revised capacity assumptions.

## Stop conditions
Abort when safety, data integrity, or uncontrolled production impact is possible.