# Resource Exhaustion Testing

## Purpose
Validate graceful behavior when CPU, memory, disk, file descriptors, threads, connections, or pools approach exhaustion.

## When to use
Use when saturation has caused incidents or capacity limits can trigger cascading failures.

## Inputs
Resource limits, autoscaling policy, workload profile, runtime metrics, and overload controls.

## Context to inspect
Inspect quotas, container limits, garbage collection, thread/connection pools, disk usage, queue growth, autoscaling signals, and admission controls.

## Core knowledge
Resource exhaustion often creates nonlinear degradation. Healthy systems shed load, bound queues, preserve critical work, and recover without corrupting state.

## Procedure
1. Select one resource and expected protection mechanism.
2. Define safe saturation and abort thresholds.
3. Establish baseline utilization and latency.
4. Increase pressure gradually.
5. Observe queuing, throttling, autoscaling, rejection, and recovery.
6. Check critical-path prioritization.
7. Remove pressure and measure recovery time.
8. Capture capacity and control gaps.

## Decision points
Prefer workload-driven pressure when validating real capacity behavior; use synthetic exhaustion when isolating a resource-specific mechanism.

## Common failure patterns
Driving hosts to unrecoverable states, testing multiple resources simultaneously, ignoring queue growth, autoscaling on lagging signals, and no load shedding.

## Verification
Confirm safeguards trigger before catastrophic exhaustion and the system returns to baseline without leaks or manual cleanup.

## Expected output
Resource saturation thresholds, observed failure mode, and remediation recommendations.

## Stop conditions
Stop before irreversible disk/data damage, host instability beyond scope, or loss of observability/control.