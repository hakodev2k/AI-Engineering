# Incident Response and Root-Cause Analysis

## Purpose
Restore feature platform service safely and identify systemic causes of training or serving incidents.

## When to use
Use for stale/missing features, bad materialization, online latency, corrupted history or widespread consumer failures.

## Inputs
Incident symptoms, timeline, alerts, logs, metrics, deployments, affected features/models and runbooks.

## Context to inspect
Recent changes, pipeline state, source health, online store, registry changes, quality checks and consumer impact.

## Core knowledge
Mitigation and root cause are separate phases. Feature incidents can silently affect model quality even when APIs remain available.

## Procedure
1. Establish incident commander and impact scope.
2. Determine affected features, entities, time ranges and models.
3. Freeze risky changes and preserve evidence.
4. Choose safest mitigation: rollback, disable publication, fallback, rematerialize or isolate traffic.
5. Verify recovery using consumer-visible signals.
6. Build a timestamped event/change timeline.
7. Trace causal chain through source, compute, publication and serving layers.
8. Identify missing detection/control, not only triggering defect.
9. Create corrective actions with owners and verification criteria.
10. Repair historical data deliberately if required.

## Decision points
Prefer rollback when a recent reversible change strongly correlates with impact; avoid speculative fixes that destroy evidence.

## Common failure patterns
Restart loops, declaring recovery from job status alone, editing history during investigation and blaming a single operator.

## Verification
Confirm SLO/freshness/value recovery, affected model behavior, historical repair and regression guardrails.

## Expected output
Restored service plus evidence-based RCA and preventive actions.

## Stop conditions
Escalate when mitigation risks data loss, security impact or destructive production changes.