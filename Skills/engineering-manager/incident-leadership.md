# Incident Leadership

## Purpose
Provide calm organizational leadership during serious production incidents while enabling technical responders to diagnose and restore service effectively.

## When to use
Use for high-severity incidents, security-adjacent outages, prolonged degradation, or incidents requiring multi-team coordination and executive communication.

## Inputs
Incident symptoms, severity criteria, service ownership, telemetry, responders, customer impact, communication channels, and escalation policy.

## Context to inspect
Inspect current impact, incident command roles, responder load, recent changes, dependencies, communication status, and whether safety or security procedures apply.

## Core knowledge
During incidents, restoration and containment usually precede root-cause analysis. Clear roles reduce cognitive load. Managers should remove organizational blockers and communication burden rather than commandeer technical diagnosis without context.

## Procedure
1. Confirm severity and activate the appropriate response process.
2. Establish incident commander, technical leads, communications owner, and scribe as needed.
3. Clarify current customer impact and containment options.
4. Protect responders from unrelated interruptions.
5. Ensure hypotheses and actions are logged with timestamps.
6. Escalate dependencies and access blockers quickly.
7. Maintain concise stakeholder communication at an appropriate cadence.
8. Prefer reversible mitigations when diagnosis is uncertain.
9. Confirm recovery with user-impact evidence, not only internal health signals.
10. Schedule a blameless review and ensure follow-up ownership.

## Decision points
Choose rollback, feature disablement, traffic reduction, failover, or continued diagnosis based on blast radius and reversibility. Escalate security indicators to the security incident process.

## Common failure patterns
Too many commanders, executives debugging in the response channel, premature root-cause debates, unlogged changes, declaring recovery from one metric, and exhausting responders.

## Verification
Verify impact has returned to acceptable levels, mitigations are stable, communications are complete, temporary changes are tracked, and follow-up review is owned.

## Expected output
Restored service plus a reliable incident record, stakeholder status, and owned follow-up actions.

## Stop conditions
Escalate immediately for suspected breach, safety risk, legal notification requirements, or recovery actions exceeding delegated authority.