# Storage Performance Analysis

## Purpose
Diagnose storage latency, throughput, and IOPS problems by locating the actual bottleneck across application, host, network, controller, media, and background work.

## When to use
Use for SLO regressions, saturation, latency spikes, noisy-neighbor reports, or pre-production validation.

## Inputs
Latency percentiles, IOPS, throughput, queue depth, utilization, request sizes, host metrics, network metrics, and storage telemetry.

## Preconditions
Establish a time-correlated symptom window and a known-good baseline.

## Context to inspect
Application traces, filesystem/database metrics, host IO statistics, multipath, NICs, switches, storage queues, cache, devices, replication, rebuilds, snapshots, and throttles.

## Core knowledge
High latency is often queueing, not slow media. Utilization, concurrency, service time, queue depth, cache behavior, and backpressure must be interpreted together. Tail latency matters for user-visible SLOs.

## Procedure
1. Define the failing SLO and exact interval.
2. Correlate application and storage latency.
3. Compare demand with baseline.
4. Inspect host queues and throttling.
5. Inspect network loss/retransmission/congestion.
6. Inspect controller/cache/device saturation.
7. Identify background operations and contention.
8. Form one falsifiable hypothesis at a time.
9. Reproduce safely with representative load.
10. Change one relevant variable and remeasure.

## Decision points
Tune only after identifying the constrained resource. Add capacity when demand is legitimate and sustained; reduce amplification or contention when architecture/application behavior is the cause.

## Common failure patterns
Optimizing averages, changing multiple knobs, blaming disks before checking queues/network, benchmarking from cache, and ignoring degraded/rebuild activity.

## Verification
Show before/after percentile latency and resource utilization under equivalent load, with no regression in durability or correctness.

## Expected output
A root-cause statement, evidence timeline, remediation, measured improvement, and residual risks.

## Stop conditions
Stop when telemetry cannot distinguish layers, production experiments could threaten data, or symptoms require vendor-level diagnostics unavailable to the operator.
