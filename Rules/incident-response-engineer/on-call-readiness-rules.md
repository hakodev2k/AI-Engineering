# On-Call Readiness Rules

## Purpose
Ensure responders have the access, context, tooling, and support required before an incident occurs.

## Scope
On-call rotations, access, escalation, training, documentation, and operational readiness.

## MUST
- Verify responders can access required systems, telemetry, communication channels, and approved production tools before their rotation.
- Maintain current escalation paths and ownership for critical services and dependencies.
- Define when responders must escalate rather than continue solo investigation.
- Provide safe access to tested runbooks and recent operational changes.

## MUST NOT
- Depend on a single unavailable individual for critical recovery knowledge or authorization.
- Grant standing broad production privilege merely for convenience when narrower just-in-time access is practical.

## SHOULD
- Use shadowing, simulations, and readiness checks before assigning independent high-severity on-call responsibility.

## Exceptions
Emergency access mechanisms may exist but MUST be auditable, least-duration, and reviewed after use.

## Verification
Run periodic access tests, escalation drills, contact audits, runbook reviews, and rotation readiness checks.