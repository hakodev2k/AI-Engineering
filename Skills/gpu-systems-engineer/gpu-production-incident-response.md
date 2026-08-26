# GPU Production Incident Response

## Purpose
Restore GPU-backed services safely while preserving enough evidence to determine root cause and prevent recurrence.

## When to use
Use for accelerator fleet degradation, OOM storms, device loss, latency collapse, collective hangs, driver faults, or capacity exhaustion.

## Inputs
Incident timeline, SLO impact, alerts, logs, GPU telemetry, scheduler state, recent changes, topology, runbooks.

## Preconditions
Establish incident ownership, severity, communication channel, and safe rollback authority.

## Context to inspect
Inspect user impact, queue depth, device health, memory, clocks, recent deployments, driver/runtime changes, placement, collectives, network, host health, and correlated failures.

## Core knowledge
Incident response prioritizes impact reduction over perfect diagnosis. GPU failures can cascade through retries, queueing, distributed collectives, and scheduler rescheduling. Evidence should be captured before destructive remediation when feasible.

## Procedure
1. Quantify user/job impact and declare severity.
2. Freeze unnecessary changes.
3. Identify blast radius by GPU/node/workload/version.
4. Capture key logs, telemetry, topology, and recent-change data.
5. Apply the lowest-risk mitigation: rollback, drain, shed load, disable a feature, or reroute.
6. Bound retries and queue growth.
7. Validate service recovery against SLOs.
8. Separate hardware, software, capacity, and dependency hypotheses.
9. Reproduce offline when possible.
10. Identify root cause and contributing factors.
11. Add prevention/detection actions and verify them.

## Decision points
Drain unhealthy devices when reliability is uncertain. Roll back recent changes when correlation and risk justify it. Prefer load shedding over retry amplification during saturation.

## Common failure patterns
Restart loops, evidence destruction, unbounded retries, changing multiple variables, ignoring queueing, returning suspect GPUs too early, and declaring recovery from average latency alone.

## Verification
Verify SLO recovery, queue normalization, device health, error-rate decline, no hidden backlog, and effectiveness of the permanent fix or guardrail.

## Expected output
Recovered service, evidence-backed incident timeline, root cause, remediation, and prevention actions.

## Stop conditions
Escalate immediately for unsafe hardware conditions, broad driver/kernel faults, data-integrity uncertainty, unauthorized production changes, or unresolved multi-tenant security impact.