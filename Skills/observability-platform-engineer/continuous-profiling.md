# Continuous Profiling

## Purpose
Use continuous profiling to diagnose CPU, memory, allocation, lock, and runtime hotspots that metrics and traces cannot localize precisely.

## When to use
Use for sustained resource growth, unexplained latency, runtime regressions, or platform-wide performance analysis.

## Inputs
Profiles, runtime/version, workload shape, deployment history, resource metrics, performance objectives.

## Context to inspect
Inspect sampling frequency, symbolization, labels, deployment metadata, runtime overhead, and profile retention.

## Core knowledge
Understand sampled profiling, flame graphs, CPU time, wall time, allocations, heap retention, lock contention, symbolization, and statistical comparison.

## Procedure
1. Define the performance symptom and comparison window.
2. Capture representative profiles under realistic load.
3. Segment by service, version, instance, and workload where safe.
4. Identify dominant stacks and regressions against a healthy baseline.
5. Correlate profile changes with metrics, traces, and deployments.
6. Form a code/runtime hypothesis before optimizing.
7. Apply the smallest targeted change.
8. Re-profile and benchmark after the change.
9. Track profiling overhead and sensitive symbol exposure.

## Decision points
Use continuous sampling for broad production visibility; use targeted higher-detail profiling only when overhead and access risk are controlled.

## Common failure patterns
Reading flame graphs without workload context, optimizing low-impact stacks, comparing different traffic mixes, and treating sampled counts as exact timings.

## Verification
Confirm measurable CPU, memory, allocation, or latency improvement under equivalent workload and ensure no regression elsewhere.

## Expected output
An evidence-backed hotspot analysis and verified performance change.

## Stop conditions
Stop if profiling overhead, symbol sensitivity, or production safety cannot be bounded.