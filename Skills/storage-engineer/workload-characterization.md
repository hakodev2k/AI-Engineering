# Workload Characterization

## Purpose
Turn application behavior into measurable storage requirements so design and tuning decisions are based on evidence rather than device specifications or averages.

## When to use
Use before sizing, migration, performance tuning, incident analysis, or storage technology selection.

## Inputs
Telemetry, traces, application behavior, request sizes, read/write ratios, queue depth, concurrency, working-set size, growth, and business cycles.

## Preconditions
Ensure measurements cover representative peak and steady-state periods and distinguish client latency from storage-service latency.

## Context to inspect
Hosts, filesystems, volumes, protocols, caching layers, databases, batch windows, replication, snapshots, and network paths.

## Core knowledge
IOPS alone is insufficient. Request size, sequentiality, locality, concurrency, sync semantics, cache hit rate, burstiness, tail latency, and read/write amplification determine actual demand.

## Procedure
1. Identify business-critical operations.
2. Capture peak and baseline windows.
3. Measure IOPS, bandwidth, latency percentiles, request-size distribution, queue depth, and utilization.
4. Separate reads, writes, metadata, and background IO.
5. Identify sequential/random and hot/cold patterns.
6. Quantify bursts and sustained demand.
7. Map workload phases to application events.
8. Estimate growth and concurrency changes.
9. Build representative replay or synthetic profiles.
10. Record uncertainty and safety margin.

## Decision points
Use production traces when safe and privacy-compliant; otherwise derive synthetic profiles from aggregated telemetry. Size for sustained peaks when throttling is unacceptable; use controlled burst capacity when demand is short-lived and predictable.

## Common failure patterns
Using daily averages, ignoring p99 latency, mixing multiple workloads into one aggregate, benchmarking with unrealistic block sizes, and overlooking background jobs.

## Verification
Compare the characterized profile with independent telemetry and application events; reproduce key latency/throughput behavior in a controlled test.

## Expected output
A workload profile containing demand distributions, peaks, access patterns, growth assumptions, and a reproducible test model.

## Stop conditions
Stop when telemetry is incomplete, clocks are inconsistent, workloads cannot be safely attributed, or privacy rules prohibit required trace collection.
