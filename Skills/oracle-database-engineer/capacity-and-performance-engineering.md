# Capacity and Performance Engineering

## Purpose
Forecast and validate Oracle CPU, memory, I/O, storage, concurrency, and throughput capacity before saturation becomes an incident.

## When to use
Use for growth planning, consolidation, release readiness, infrastructure changes, and seasonal/peak events.

## Inputs
Historical workload metrics, business growth forecasts, data growth, SLAs, architecture limits, licensing and infrastructure costs.

## Context to inspect
DB time, AAS, CPU utilization/queues, IOPS/latency, memory/temp, connection/session counts, redo rates, data/FRA growth, batch windows, and peak patterns.

## Core knowledge
Capacity is multidimensional; average utilization hides burst and tail-latency risk. Oracle licensing and infrastructure constraints can make architectural efficiency as important as raw scale.

## Procedure
1. Establish current peak demand and service-level headroom.
2. Separate business growth from inefficiency or regression.
3. Trend data, redo, sessions, CPU, I/O, memory, temp, and backup durations.
4. Identify hard platform and licensing limits.
5. Model forecast scenarios with uncertainty ranges.
6. Load-test critical growth assumptions where practical.
7. Optimize dominant inefficient SQL/workloads before buying capacity.
8. Evaluate scale-up, scale-out, partitioning, workload scheduling, or archival options.
9. Define threshold dates and procurement/change lead times.
10. Revisit forecasts after major releases or workload shifts.

## Decision points
Scale infrastructure when workload is efficient and demand is real; tune or redesign when resource consumption is disproportionate to business work.

## Common failure patterns
Linear forecasts from averages, ignoring backup/maintenance windows, capacity plans based only on storage, and buying CPU while I/O is bottlenecked.

## Verification
Compare model predictions with subsequent peaks and validate headroom through load or replay testing.

## Expected output
A capacity forecast with bottlenecks, thresholds, options, and trigger dates.

## Stop conditions
Stop when business forecasts or current workload telemetry are too incomplete for decision-grade modeling.