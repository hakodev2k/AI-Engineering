# Production Incident Response

## Purpose
Diagnose and mitigate data-platform incidents rapidly while preserving evidence, limiting blast radius, and driving durable follow-up.

## When to use
Use for outages, stale or incorrect data, runaway costs, failed pipelines, capacity collapse, or security-impacting platform degradation.

## Inputs
Incident symptoms, alerts, logs, metrics, traces, lineage, deployment history, runbooks, and recent changes.

## Context to inspect
Affected consumers/datasets, dependency health, job state, resource saturation, access changes, schema changes, and prior similar incidents.

## Core knowledge
Mitigation precedes perfect diagnosis when impact is active. Data incidents may persist after service recovery because incorrect outputs require repair. Preserve timestamps and evidence; avoid uncontrolled simultaneous changes.

## Procedure
1. Establish severity, commander, communication channel, and current impact.
2. Identify affected datasets, consumers, and time window.
3. Freeze risky changes where appropriate.
4. Compare symptoms with recent deployments/config/schema changes.
5. Use telemetry and lineage to narrow the failing boundary.
6. Apply the lowest-risk reversible mitigation.
7. Validate service and data recovery separately.
8. Repair or quarantine incorrect outputs with explicit scope.
9. Capture timeline, evidence, and decisions.
10. Conduct blameless root-cause analysis and assign systemic actions.
11. Verify follow-up changes close detection and prevention gaps.

## Decision points
Rollback when change correlation is strong and rollback is data-safe; otherwise isolate or forward-fix. Fail closed for dangerous incorrect data; degraded/stale service may be preferable when explicitly understood.

## Common failure patterns
Changing many variables at once, deleting evidence, declaring recovery when pipelines are green but data is wrong, unbounded backfills, weak communication, and root cause reduced to human error.

## Verification
Confirm SLO recovery, reconcile affected data, validate consumer impact is cleared, and test preventive actions after implementation.

## Expected output
Mitigation, validated recovery, incident timeline, root cause, affected-data scope, and prioritized corrective actions.

## Stop conditions
Escalate immediately for suspected compromise, destructive repair, missing production authority, or uncertainty where mitigation could increase impact.