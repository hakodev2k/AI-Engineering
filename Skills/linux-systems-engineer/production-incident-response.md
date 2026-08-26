# Production Incident Response

## Purpose
Restore Linux-hosted services quickly while preserving evidence and reducing secondary failure.

## When to use
Use for active outages, severe degradation, host compromise indicators, resource exhaustion, or cascading infrastructure failures.

## Inputs
Symptoms, impact, timeline, alerts, topology, recent changes, runbooks, and recovery options.

## Context to inspect
Inspect health, dependencies, recent changes, saturation, logs, security indicators, redundancy, and rollback capability.

## Core knowledge
Optimize first for safe restoration and evidence quality. Separate mitigation from root-cause analysis; use explicit hypotheses and bounded changes.

## Procedure
1. Confirm impact, severity, and scope.
2. Establish coordination and a timestamped timeline.
3. Preserve volatile evidence.
4. Check recent changes and broad resource/dependency health.
5. Rank hypotheses by evidence and reversibility.
6. Apply the safest high-leverage mitigation.
7. Verify user-visible recovery.
8. Monitor for recurrence.
9. Perform root-cause analysis after stabilization.
10. Create corrective actions with owners.

## Decision points
Rollback when a recent change is strongly correlated and reversible; fail over when redundancy is safer than repair; reboot only when benefit exceeds evidence-loss and recurrence risk.

## Common failure patterns
Multiple simultaneous changes, repeated restarts without capture, weak communication, declaring recovery from process status alone, and blame-focused postmortems.

## Verification
User-facing SLOs recover, alerts clear for the right reason, resources stabilize, dependencies are healthy, and no hidden data/security issue remains.

## Expected output
Restored service, incident timeline, evidence-backed cause or hypothesis, and follow-up actions.

## Stop conditions
Escalate for suspected compromise, data corruption, destructive recovery, or authority beyond responder scope.