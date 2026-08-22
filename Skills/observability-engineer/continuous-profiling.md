# Continuous Profiling

## Purpose
Use production profiles to identify CPU, allocation, lock, and runtime hotspots that request telemetry cannot explain precisely.

## When to use
Use for persistent performance or cost problems, unexplained resource consumption, and regression detection when profiling overhead is acceptable.

## Inputs
Runtime, profiler capabilities, workload, privacy constraints, resource budget, and deployment metadata.

## Context to inspect
Inspect CPU samples, allocations, heap behavior, locks, stack traces, symbol availability, versions, and workload segmentation.

## Core knowledge
Sampling profilers trade precision for low overhead and are usually safer for continuous use than instrumentation profilers. Profiles require workload and version context to be actionable.

## Procedure
1. Define the resource question.
2. Select CPU, allocation, lock, wall-time, or other profile type.
3. Establish overhead budget.
4. Enable profiling on a controlled scope.
5. Tag profiles with service and version metadata.
6. Compare hot paths across healthy and problematic periods.
7. Confirm findings against traces and metrics.
8. Implement targeted changes.
9. Re-profile under comparable load.

## Decision points
Use continuous low-overhead sampling for trends; use deeper targeted profiling only when needed and safe.

## Common failure patterns
Reading flame graphs without workload context, optimizing cold paths, exposing sensitive stack metadata, and treating samples as exact timing.

## Verification
Demonstrate hotspot reduction in comparable profiles and confirm corresponding resource or latency improvement.

## Expected output
Reproducible profiling evidence linked to measurable production outcomes.

## Stop conditions
Disable or escalate if profiler overhead, privacy impact, or runtime instability exceeds approved limits.