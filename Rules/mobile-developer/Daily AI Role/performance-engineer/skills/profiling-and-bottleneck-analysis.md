# Profiling and Bottleneck Analysis

## Purpose
Find the dominant resource or wait path responsible for observed performance behavior.

## Inputs
Profiles, traces, metrics, logs, code, query plans, resource telemetry, dependency timings.

## Procedure
1. Reproduce the issue under a controlled workload.
2. Determine whether the symptom is latency, throughput, saturation, contention, memory pressure, or instability.
3. Correlate wall time with CPU, allocation/GC, locks, I/O, database, cache, network, queues, and downstream calls.
4. Build ranked hypotheses.
5. Isolate one hypothesis with targeted instrumentation or experiment.
6. Confirm the bottleneck shifts or disappears after a controlled change.
7. Record remaining secondary bottlenecks.

## Constraints
Do not optimize low-contribution code paths merely because they look expensive in isolation.

## Output
Bottleneck report with evidence, confidence, and recommended next experiment.

## Verification
Evidence explains the measured symptom and survives a repeated run.

## Failure handling
If data sources disagree, preserve both and redesign instrumentation before tuning.

## Stop condition
One or more dominant bottlenecks are causally supported or the investigation is escalated with explicit uncertainty.