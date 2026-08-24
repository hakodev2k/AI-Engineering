# AI Infrastructure Incident Response

## Purpose
Diagnose and stabilize production incidents involving accelerator fleets, model serving, distributed training, storage, networking, or schedulers.

## When to use
Use for active degradation, unexplained job failures, inference SLO violations, or widespread accelerator health issues.

## Inputs
Incident symptoms, alerts, logs, metrics, traces, recent changes, scheduler events, node/GPU health data.

## Context to inspect
Blast radius, tenant/workload impact, recent deployments, device errors, queue depth, network/storage health, capacity, and control-plane status.

## Core knowledge
Incident response prioritizes containment and evidence preservation before deep optimization. AI failures often cross layers: application, runtime, driver, accelerator, network, storage, and scheduler.

## Procedure
1. Establish severity, affected workloads, and start time.
2. Freeze unnecessary changes and preserve evidence.
3. Check recent deployments and fleet changes.
4. Separate workload-specific failures from node/pool/platform failures.
5. Inspect device health, capacity, scheduler, network, and storage signals.
6. Apply the lowest-risk containment: reroute, drain, rollback, quarantine, or reduce load.
7. Verify user impact is improving.
8. Identify root cause only after stabilization.
9. Record timeline, contributing factors, and follow-up actions.

## Decision points
Rollback when a recent change strongly correlates and rollback is safe. Drain/quarantine hardware for repeated device faults. Shed low-priority work to protect critical inference.

## Common failure patterns
Restart loops that erase evidence, blaming the model before checking infrastructure, replacing healthy nodes indiscriminately, and declaring recovery from averages while tails remain bad.

## Verification
Confirm SLO recovery, healthy job completion, stable device error rates, and no hidden backlog growth.

## Expected output
A stabilized platform, incident record, root-cause evidence, and corrective actions.

## Stop conditions
Escalate when destructive actions, provider intervention, security impact, or physical hardware access is required.