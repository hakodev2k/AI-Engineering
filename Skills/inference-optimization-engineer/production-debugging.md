# Production Debugging

## Purpose
Diagnose inference regressions and outages systematically across application, scheduler, runtime, accelerator, and infrastructure layers.

## When to use
Use for latency spikes, throughput collapse, OOM, device errors, correctness changes, request hangs, or failures that appear only under production traffic.

## Inputs
Incident timeline, logs, traces, metrics, deployment history, model/runtime versions, profiler evidence, workload samples, and recent configuration changes.

## Context to inspect
Inspect queue growth, TTFT/decode latency, GPU memory and utilization, active batches, KV cache, kernel/runtime errors, host CPU, network, retries, autoscaling, model reloads, and workload mix.

## Core knowledge
Inference incidents are often cross-layer. A latency regression can originate from longer prompts, scheduler changes, cache fragmentation, fallback kernels, network saturation, or failing replicas. Correlation is not causation; establish a reproducible hypothesis and control variables.

## Procedure
1. Define user impact, start time, scope, and current severity.
2. Stabilize service with rollback, traffic reduction, or fallback if needed.
3. Compare affected and healthy cohorts by model, runtime, hardware, region, and workload.
4. Correlate the incident with deployments and traffic-shape changes.
5. Decompose latency and resource metrics by serving stage.
6. Check queue saturation, memory pressure, device errors, and retry amplification.
7. Reproduce with captured workload characteristics when safe.
8. Form the smallest testable root-cause hypothesis.
9. Change one variable at a time and collect evidence.
10. Implement the minimal safe fix or rollback.
11. Verify recovery using SLO and resource metrics.
12. Add regression tests, alerts, or guardrails that would catch recurrence.
13. Document root cause and contributing factors separately.

## Decision points
Rollback early when a recent reversible change strongly correlates with severe impact. Profile deeply after stabilization when the issue is performance rather than active availability loss. Escalate hardware/runtime defects with minimal reproducible evidence.

## Common failure patterns
Restarting until symptoms disappear, tuning multiple parameters simultaneously, blaming GPU utilization alone, ignoring workload-shape changes, debugging only averages, and declaring recovery without p99 verification.

## Verification
A fix is implemented when the suspected defect is changed; it is verified only when affected metrics recover under representative load, the failure cannot be reproduced, and regression coverage exists where feasible.

## Expected output
Incident timeline, evidence-backed root cause, remediation, before/after metrics, and prevention actions.

## Stop conditions
Escalate immediately for suspected data leakage, persistent device corruption, unexplained numerical correctness changes, destructive actions, or missing production permissions required for safe diagnosis.