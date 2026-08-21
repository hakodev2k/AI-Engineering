# Cloud Incident Response

## Purpose
Diagnose and contain production cloud incidents while preserving evidence, limiting blast radius, and restoring service safely.

## When to use
Use for outages, security events, unexplained resource changes, data-service failures, quota exhaustion, and control-plane issues.

## Inputs
Incident symptoms, timeline, alerts, logs, recent changes, topology, runbooks, SLO impact.

## Context to inspect
Cloud audit logs, service metrics, deployment history, IAM events, network flows, provider status, quotas, dependency health.

## Core knowledge
Incident work separates stabilization from root-cause analysis. Prefer reversible, scoped actions and maintain a timeline of evidence and decisions.

## Procedure
1. Establish severity, commander, and communication channel.
2. Define user impact and affected scope.
3. Check recent changes and provider health.
4. Use telemetry to identify failing dependency or saturation.
5. Contain security or runaway-resource risks.
6. Apply the smallest safe mitigation.
7. Verify service recovery from user-facing signals.
8. Preserve logs and timeline.
9. Identify root and contributing causes after stabilization.
10. Create corrective actions with owners.

## Decision points
Rollback when a recent change strongly correlates and rollback risk is lower than diagnosis delay. Fail over only when target recovery path is known healthy.

## Common failure patterns
Many simultaneous changes, deleting evidence, assuming provider outage, alert-driven tunnel vision, and declaring recovery from host metrics alone.

## Verification
Confirm customer-facing SLO recovery and absence of continued error growth.

## Expected output
Restored service, evidence timeline, cause analysis, and follow-up actions.

## Stop conditions
Escalate destructive actions, suspected compromise, or changes outside authorized access.