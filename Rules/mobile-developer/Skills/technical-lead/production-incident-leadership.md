# Production Incident Leadership

## Purpose
Coordinate technical response to production incidents while protecting service recovery, evidence, and team focus.

## When to use
Use during significant outages, data integrity events, severe degradation, or recurring production failures.

## Inputs
Alerts, logs, metrics, traces, deployment history, incident reports, architecture, runbooks.

## Context to inspect
Inspect user impact, affected components, recent changes, dependencies, capacity, security indicators, and recovery options.

## Core knowledge
During incidents, restore safe service before pursuing perfect diagnosis. Separate incident command, investigation, communication, and remediation when scale warrants it.

## Procedure
1. Establish severity and user impact.
2. Assign incident leadership and communication ownership.
3. Stabilize the system using reversible mitigations.
4. Preserve evidence and timeline.
5. Form hypotheses from telemetry, not intuition alone.
6. Test hypotheses with low-risk checks.
7. Roll back or isolate suspect changes when justified.
8. Confirm recovery through user-facing signals.
9. Capture root and contributing causes afterward.
10. Assign durable corrective actions with owners.

## Decision points
Rollback when change correlation and rollback safety are stronger than continued diagnosis. Fail over only when secondary capacity and consistency are understood.

## Common failure patterns
Too many responders changing systems, premature root-cause claims, risky fixes under pressure, weak communication, and postmortems focused on blame.

## Verification
Service indicators recover, customer impact stops, and corrective actions address contributing system conditions.

## Expected output
Recovered service, incident timeline, evidence-based analysis, and owned follow-up actions.

## Stop conditions
Escalate immediately for suspected security compromise, irreversible data loss, or actions requiring privileged emergency authority.