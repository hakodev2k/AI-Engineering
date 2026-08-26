# Windows Performance Diagnostics

## Purpose
Diagnose CPU, memory, disk, network, kernel, and application resource bottlenecks using measured evidence rather than tuning guesses.

## When to use
Use for slow servers, latency spikes, saturation, hangs, resource exhaustion, or capacity investigations.

## Inputs
Symptom, time window, workload baseline, affected hosts, metrics, event logs, process data, and recent changes.

## Preconditions
Preserve timestamps and establish whether the issue is current, intermittent, or historical.

## Context to inspect
Task Manager for orientation, Performance Monitor counters, Resource Monitor, process/thread data, ETW/WPR traces where justified, disk latency/queue, memory commit and paging, CPU run queues, network errors, and application telemetry.

## Core knowledge
Utilization alone is not a bottleneck. Correlate demand, saturation, latency, and errors. Understand working set versus commit, paging versus normal file cache, logical versus physical CPU, storage latency, and queueing effects.

## Procedure
1. Define a user-visible performance symptom and interval.
2. Establish a healthy baseline or comparison host.
3. Correlate CPU, memory, disk, network, and application latency.
4. Identify the constrained resource and owning processes/workload.
5. Drill into threads, I/O, allocations, or network flows as evidence requires.
6. Correlate with deployments, backups, scans, patches, or scheduled tasks.
7. Form a falsifiable bottleneck hypothesis.
8. Apply one targeted mitigation or configuration change.
9. Re-measure under comparable load.
10. Document before/after evidence and capacity implications.

## Decision points
Scale resources when demand is legitimate and architecture supports it; optimize when inefficient work is causal. Use ETW when coarse counters cannot explain CPU, I/O, or scheduling behavior.

## Common failure patterns
Tuning registry values first, treating high memory use as leakage, clearing caches to create temporary improvement, collecting no baseline, and changing multiple resources at once.

## Verification
Compare latency, throughput, errors, saturation, and resource headroom before and after under representative load.

## Expected output
A quantified bottleneck diagnosis and measured remediation result.

## Stop conditions
Stop when reproduction risks production stability, trace collection is too invasive, application internals require another owner, or evidence does not support the proposed change.