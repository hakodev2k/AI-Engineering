# Incident Command and Communications

## Purpose
Coordinate responders, decisions, status updates, and stakeholder communication during complex AI incidents.

## When to use
Use for multi-team or high-severity incidents involving model, platform, safety, security, privacy, provider, or business stakeholders.

## Inputs
Severity, scope, owners, incident channel, stakeholder list, communication policy, current mitigation status.

## Preconditions
An incident commander or equivalent accountable lead is assigned.

## Context to inspect
Escalation paths, on-call ownership, regulatory/customer communication rules, executive notification thresholds.

## Core knowledge
High-severity incidents fail organizationally when ownership and decision rights are unclear. AI incidents often require specialists who interpret probabilistic evidence differently.

## Procedure
1. Assign incident commander, technical lead, communications lead, and scribe.
2. Establish a single source of truth.
3. State current impact, containment, and unknowns.
4. Set explicit workstreams and owners.
5. Timebox hypothesis investigation.
6. Record high-risk decisions and approvals.
7. Publish updates at agreed cadence.
8. Separate internal technical detail from external messaging.
9. Declare recovery criteria before closing.
10. Hand off follow-up work after stabilization.

## Decision points
The incident commander prioritizes containment and coordination; domain specialists own technical recommendations.

## Common failure patterns
Multiple conflicting status channels, no decision owner, excessive speculation in customer updates, and responders duplicating work.

## Verification
Owners, decisions, next checkpoints, and stakeholder status are unambiguous.

## Expected output
Coordinated incident record with roles, decisions, workstreams, and concise status updates.

## Stop conditions
Escalate communication decisions that require legal, regulatory, or executive approval.