# Platform Incident Response

## Purpose
Restore shared platform capability quickly while controlling blast radius and preserving evidence.

## When to use
Use during outages, severe degradation, security-adjacent failures, or widespread developer impact.

## Inputs
Alerts, telemetry, recent changes, architecture, runbooks, affected users, and dependency status.

## Context to inspect
Current symptoms, deployment history, control-plane health, capacity, dependencies, and known failure modes.

## Core knowledge
During incidents prioritize safety, stabilization, communication, and reversible mitigation before deep optimization.

## Procedure
1. Confirm impact and declare severity.
2. Assign incident roles and communication channel.
3. Establish timeline and recent-change context.
4. Reduce blast radius and stabilize service.
5. Prefer reversible mitigations.
6. Validate recovery through user-visible signals.
7. Monitor for recurrence.
8. Preserve evidence and produce follow-up actions.

## Decision points
Rollback when recent change correlation is strong and rollback is safe; fail over when recovery is faster and tested.

## Common failure patterns
Uncoordinated changes, debugging before stabilization, silent incidents, premature closure, and action items without owners.

## Verification
Critical journeys recover, SLO indicators normalize, stakeholders receive status, and evidence supports the incident timeline.

## Expected output
Recovered service plus incident record, impact, mitigation, contributing factors, and owned follow-ups.

## Stop conditions
Escalate immediately for suspected compromise, data loss, or recovery actions exceeding authority.