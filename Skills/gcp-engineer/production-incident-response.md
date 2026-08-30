# Production Incident Response

## Purpose
Diagnose and mitigate GCP production incidents using evidence-driven triage, scoped changes, communication, and post-incident learning.

## When to use
Use for outages, severe latency, data-path failures, quota exhaustion, dependency incidents, or security-impacting cloud failures.

## Inputs
Incident symptoms, timeline, affected services, dashboards, logs, traces, recent changes, and business impact.

## Context to inspect
Cloud Monitoring, Logging, Error Reporting, audit logs, deployment history, quotas, service health, network changes, IAM changes, and dependent services.

## Core knowledge
Mitigation takes priority over perfect diagnosis during active impact. Correlation is not causation; use timelines and counterfactual evidence before declaring root cause.

## Procedure
1. Establish incident commander and impact statement.
2. Freeze unrelated changes.
3. Identify affected user journeys and regions.
4. Check recent deploy/config/IAM/network changes.
5. Inspect golden signals and dependency health.
6. Apply the lowest-risk reversible mitigation.
7. Validate recovery with user-facing indicators.
8. Preserve evidence and timeline.
9. Complete root-cause analysis after stabilization.
10. Create specific prevention and detection actions.

## Decision points
Rollback when a recent change strongly correlates and rollback is safe. Fail over only when destination capacity and state are validated.

## Common failure patterns
Changing multiple variables at once, restarting without evidence, ignoring quota/rate limits, and declaring recovery from infrastructure metrics alone.

## Verification
Confirm user-facing SLI recovery, absence of data corruption, and stability over an appropriate observation window.

## Expected output
A mitigated incident with evidence, timeline, root cause, and corrective actions.

## Stop conditions
Escalate immediately for suspected data loss, credential compromise, or destructive recovery steps.