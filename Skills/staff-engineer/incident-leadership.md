# Incident Leadership

## Purpose
Provide senior technical leadership during severe or cross-team production incidents, accelerating diagnosis while preserving safe decision making and clear ownership.

## When to use
Use for high-severity incidents, ambiguous multi-system failures, repeated failed mitigations, or incidents requiring architectural judgment across teams.

## Inputs
Incident timeline, telemetry, recent changes, dependency map, runbooks, user impact, available responders.

## Preconditions
An incident commander or equivalent coordination role exists or can be established.

## Context to inspect
Current impact, failing user journeys, deploy history, metrics, logs, traces, dependency health, capacity signals, and prior similar incidents.

## Core knowledge
During incidents, optimize for restoring service safely before exhaustive root-cause analysis. Separate coordination from technical investigation, maintain hypotheses, time-box experiments, and avoid uncontrolled concurrent changes.

## Procedure
1. Confirm severity, scope, and user impact.
2. Establish technical and coordination roles.
3. Freeze unnecessary changes.
4. Build a shared timeline and hypothesis list.
5. Identify the safest high-information checks.
6. Prefer reversible mitigations that reduce impact.
7. Track every change and observed result.
8. Reassess hypotheses after each material signal.
9. Validate recovery with user-facing metrics.
10. Preserve evidence for post-incident analysis.

## Decision points
Rollback when a recent change plausibly explains impact and rollback is safe. Degrade optional functionality when it protects critical journeys. Avoid risky remediation when containment is available.

## Common failure patterns
Too many responders changing systems, tunnel vision, debugging before mitigating, undocumented actions, relying on one telemetry source, and declaring recovery before metrics stabilize.

## Verification
Confirm user-facing recovery, stable service health, no hidden backlog or data corruption, and an explicit handoff to follow-up investigation.

## Expected output
Restored service, incident timeline, validated mitigation, open hypotheses, and prioritized follow-up actions.

## Stop conditions
Escalate immediately when data integrity, security compromise, destructive recovery, or authority-sensitive actions are involved.