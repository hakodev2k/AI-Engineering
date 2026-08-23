# Production Incident Troubleshooting

## Purpose
Diagnose Azure production incidents systematically, restore service safely, and produce evidence-based root causes instead of speculative fixes.

## When to use
Use during outages, latency spikes, deployment regressions, resource exhaustion, connectivity failures, or unexplained Azure service behavior.

## Inputs
Incident timeline, symptoms, affected users, recent changes, metrics, logs, traces, Azure Service Health, resource configuration, and dependency status.

## Context to inspect
Inspect Azure Monitor, Application Insights, activity logs, resource health, Service Health, deployment history, effective network configuration, quotas, platform metrics, and dependency telemetry.

## Core knowledge
Mitigation and root-cause analysis are separate goals. Build a timeline, narrow the failure domain, compare healthy/unhealthy behavior, and prefer reversible mitigations. Correlation is not causation.

## Procedure
1. Define user-visible impact and incident start time.
2. Establish incident ownership and preserve evidence.
3. Check platform health and recent changes.
4. Inspect golden signals: traffic, errors, latency, saturation.
5. Trace failing requests across dependencies.
6. Narrow the fault domain by region, instance, dependency, network path, identity, or deployment.
7. Apply the lowest-risk reversible mitigation that restores service.
8. Verify recovery using user-facing and system signals.
9. Reconstruct the causal chain with evidence.
10. Create corrective actions for prevention, detection, and recovery.

## Decision points
Rollback when a recent reversible change strongly correlates with impact and rollback risk is lower than diagnosis delay. Scale only when evidence shows resource saturation rather than downstream failure.

## Common failure patterns
Random configuration changes, restarting before preserving evidence, assuming Azure platform fault without checking application changes, scaling around dependency errors, and declaring recovery from one green metric.

## Verification
Confirm critical user journeys recover, error/latency metrics normalize, backlog drains, dependencies stabilize, and no hidden partial impact remains.

## Expected output
Restored service plus an evidence-backed incident timeline, root cause, contributing factors, and prioritized corrective actions.

## Stop conditions
Escalate when mitigation requires destructive action, platform support is required, access is insufficient, or multiple attempts increase risk without narrowing the cause.