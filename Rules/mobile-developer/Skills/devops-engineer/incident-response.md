# Incident Response

## Purpose
Coordinate safe diagnosis and recovery during production incidents while preserving evidence and communication quality.

## When to use
Use for outages, severe degradation, security-adjacent operational failures, or widespread deployment issues.

## Inputs
Symptoms, alerts, recent changes, telemetry, dependency status, runbooks, stakeholder contacts.

## Context to inspect
Dashboards, logs, traces, deployment history, feature flags, infrastructure events, provider status, error-budget impact.

## Core knowledge
Restore service before deep root-cause work when safe. Establish command, timeline, hypotheses, ownership, and explicit decision points. Prefer reversible mitigations.

## Procedure
1. Declare severity and incident lead.
2. Capture start time and customer impact.
3. Freeze risky unrelated changes.
4. Check recent deployments/config changes.
5. Form evidence-based hypotheses.
6. Apply lowest-risk mitigation.
7. Verify recovery with user-impact metrics.
8. Communicate status at defined cadence.
9. Preserve timeline and evidence.
10. Schedule follow-up root-cause and actions.

## Decision points
Rollback when a recent change strongly correlates and rollback risk is lower; fail over when primary recovery is uncertain; avoid multiple simultaneous changes.

## Common failure patterns
No incident owner, debugging before mitigation, random changes, stale status updates, deleting evidence, declaring recovery from one metric.

## Verification
User-facing indicators recover, error rates stabilize, mitigation is documented, and ownership transfers cleanly to follow-up work.

## Expected output
Recovered service, incident timeline, evidence, and clearly owned next actions.

## Stop conditions
Escalate when blast radius grows, security compromise is possible, or available privileges are insufficient.