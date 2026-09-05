# Profiling and Bottleneck Analysis

## Purpose
Locate the real resource and execution bottlenecks before applying optimizations.

## When to use
When inference is slow, expensive, underutilized, memory-bound, or fails to scale.

## Inputs
Profiles, traces, hardware counters, model graph, request distributions, runtime configuration, baseline metrics.

## Preconditions
Reproduce the issue on representative hardware and workload with profiling overhead understood.

## Context to inspect
Inspect CPU preprocessing, host-device copies, GPU kernels, synchronization, memory allocation, graph breaks, communication, batching, queues, and postprocessing.

## Core knowledge
Critical-path latency differs from aggregate compute time. GPU utilization alone cannot distinguish useful compute from stalls. Roofline reasoning helps separate compute-, bandwidth-, launch-, and communication-bound workloads.

## Procedure
1. Reproduce baseline behavior.
2. Partition end-to-end latency into stages.
3. Capture framework and hardware profiles.
4. Identify idle gaps, synchronization, expensive operators, transfers, and allocations.
5. Correlate findings with request shape and concurrency.
6. Rank bottlenecks by expected end-to-end impact.
7. Form one optimization hypothesis at a time.
8. Change one major variable.
9. Re-profile and compare.
10. Preserve evidence for rejected hypotheses.

## Decision points
Optimize kernels only when model execution dominates. Fix queuing, batching, I/O, or preprocessing first when they dominate critical-path latency.

## Common failure patterns
Optimizing the hottest kernel without end-to-end impact; profiling unrepresentative inputs; confusing queue time with compute; ignoring CPU or network stalls.

## Verification
Profiles before and after show the targeted bottleneck reduced and end-to-end metrics improve without unacceptable quality or reliability regression.

## Expected output
Ranked bottleneck analysis, evidence, optimization experiments, and measured impact.

## Stop conditions
Stop when profiling changes behavior materially, required counters are inaccessible, or the bottleneck lies in an external system outside approved scope.