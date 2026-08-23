# Severity Assessment Rules

## Purpose
Classify incidents consistently so response urgency and governance match actual impact.

## Scope
Initial triage and severity changes throughout an incident.

## MUST
- Base severity on observable customer, business, security, data, compliance, and operational impact using the current project's severity model.
- Reassess severity when impact scope, duration, data risk, or recoverability changes materially.
- Document evidence supporting severity changes and notify affected response roles.
- Treat uncertain but potentially catastrophic impact conservatively until evidence narrows the risk.

## MUST NOT
- Lower severity merely because a workaround exists without validating its effectiveness and reach.
- Use incident duration, responder confidence, or executive attention as substitutes for impact evidence.

## SHOULD
- Define measurable thresholds for affected users, critical capabilities, data integrity, and recovery objectives.

## Exceptions
When telemetry is unavailable, use the best corroborated evidence and mark confidence explicitly until measurement is restored.

## Verification
Compare severity decisions with the documented severity matrix, telemetry, support evidence, and incident timeline.