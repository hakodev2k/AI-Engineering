# Production Incident Troubleshooting

## Purpose
Diagnose and stabilize production model-serving incidents using evidence-driven narrowing across routing, queueing, runtime, accelerator, model, network, and dependency layers.

## When to use
Use for elevated errors, latency spikes, OOMs, stalled generation, model-load failures, routing anomalies, or unexplained throughput collapse.

## Inputs
Incident symptoms, alerts, traces, logs, model/runtime versions, deployment changes, hardware metrics, scheduler metrics, and provider/dependency status.

## Preconditions
Preserve evidence and prioritize containment when user impact is growing.

## Context to inspect
Recent releases, model aliases, queue depth, TTFT, decode rate, active sequences, GPU health, memory, KV cache, runtime errors, node events, network, and storage.

## Core knowledge
Serving symptoms are often downstream of another bottleneck. High GPU utilization may be healthy; low utilization may result from queue starvation, network stalls, broken batching, or failed ranks. OOM can come from sequence mix, leaks, fragmentation, or configuration drift.

## Procedure
1. Define exact impact, start time, and affected model pools.
2. Check recent changes and correlate with onset.
3. Separate gateway, queue, runtime, compute, and dependency symptoms.
4. Compare healthy and unhealthy replicas or regions.
5. Inspect memory, KV cache, batch behavior, and accelerator errors.
6. Check model-loading and artifact integrity.
7. Contain through rollback, routing, admission control, or safe capacity changes.
8. Reproduce in a controlled environment where possible.
9. Confirm recovery through SLO and workload metrics.
10. Capture root-cause evidence and prevention actions.

## Decision points
Rollback quickly when a recent change strongly correlates with impact and a known-good state exists. Scale only when resource saturation is proven.

## Common failure patterns
Restarting before preserving evidence, adding replicas during retry storms, blaming GPU utilization alone, and closing after symptom recovery without root cause.

## Verification
SLOs remain stable through representative traffic and the suspected failure mechanism is either reproduced or disproven with evidence.

## Expected output
A timeline, containment record, root-cause hypothesis, verification evidence, and corrective actions.

## Stop conditions
Escalate when hardware faults, security exposure, or destructive recovery requires specialist approval.