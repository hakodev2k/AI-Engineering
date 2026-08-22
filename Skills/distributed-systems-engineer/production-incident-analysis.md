# Production Incident Analysis

## Purpose
Diagnose distributed production failures using evidence, timelines, correlation, and system invariants while minimizing further impact.

## When to use
Use for outages, latency spikes, message backlogs, consistency anomalies, cascading failures, and unexplained cross-service behavior.

## Inputs
Incident symptoms, timestamps, alerts, logs, metrics, traces, deployment history, topology, and runbooks.

## Preconditions
Prioritize containment and user safety before deep analysis.

## Context to inspect
Inspect recent changes, dependency health, saturation, error rates, queue lag, replica state, retries, timeouts, and regional/tenant scope.

## Core knowledge
Distributed incidents often involve amplification and multiple contributing conditions. Correlation is not causation; build a timestamped evidence chain and distinguish trigger, propagation mechanism, and latent weakness.

## Procedure
1. Establish incident start, scope, and user impact.
2. Freeze an evidence timeline using synchronized telemetry timestamps where possible.
3. Identify the first abnormal signal rather than the loudest downstream symptom.
4. Compare healthy and unhealthy paths, regions, tenants, or instances.
5. Check saturation and dependency latency before assuming code failure.
6. Trace retry, queue, cache, and failover amplification.
7. Apply the lowest-risk containment action.
8. Verify recovery with user-facing and system metrics.
9. Preserve evidence for root-cause analysis.
10. Produce corrective actions covering trigger, propagation, detection, and recovery gaps.

## Decision points
Rollback when a recent change strongly correlates and rollback risk is lower than continued impact. Shed load or disable noncritical features when saturation threatens total failure.

## Common failure patterns
Restarting everything before collecting evidence, blaming the final failing service, changing multiple variables at once, and declaring recovery from one metric.

## Verification
Confirm user journeys, backlog recovery, error/latency normalization, and data invariants before closing mitigation.

## Expected output
An evidence-based incident timeline, cause hypothesis, mitigation, verification, and follow-up actions.

## Stop conditions
Escalate immediately for data corruption, security impact, irreversible actions, or when mitigation requires authority not available to the responder.