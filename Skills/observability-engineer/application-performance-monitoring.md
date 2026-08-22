# Application Performance Monitoring

## Purpose
Measure and diagnose application latency, throughput, errors, and resource behavior across code and dependencies.

## When to use
Use for latency regressions, release validation, bottleneck analysis, or establishing production performance baselines.

## Inputs
Application architecture, traces, metrics, profiles, deployment versions, traffic patterns, and performance objectives.

## Context to inspect
Inspect endpoint latency, dependency time, CPU, memory, GC, thread/worker pools, connection pools, queues, and recent releases.

## Core knowledge
Latency is a distribution and should be decomposed across components. Resource saturation and queueing often amplify tail latency before average utilization appears critical.

## Procedure
1. Establish baseline throughput and latency percentiles.
2. Segment by endpoint, operation, version, and bounded workload class.
3. Decompose time using traces.
4. Compare dependency and application time.
5. Inspect CPU, memory, runtime, and pool saturation.
6. Use profiling when code-level evidence is required.
7. Compare before/after releases.
8. Validate improvements under representative load.

## Decision points
Profile only after telemetry narrows the suspected resource or code path. Optimize user-impacting tails before low-value micro-optimizations.

## Common failure patterns
Using averages, optimizing without baseline evidence, blaming dependencies from correlation alone, and enabling expensive profilers indefinitely.

## Verification
Repeat representative workloads and demonstrate statistically meaningful improvement without regression in errors or resource consumption.

## Expected output
Evidence-backed bottleneck findings and validated performance changes.

## Stop conditions
Stop when workload is not representative or profiling overhead is unsafe for the target environment.