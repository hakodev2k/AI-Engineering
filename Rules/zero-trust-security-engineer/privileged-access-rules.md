# Privileged Access Rules

## Purpose
Control administrative and high-impact access with stronger verification, attribution, and approval boundaries.

## Scope
Applies to production administration, security consoles, identity systems, cloud control planes, databases, and emergency elevation.

## MUST
- Privileged access MUST use named identities with strong authentication.
- Elevation MUST be limited by role, resource, purpose, and duration.
- High-risk privileged actions MUST be logged with sufficient context for investigation.
- Destructive or security-weakening actions MUST require human approval when policy mandates it.

## MUST NOT
- MUST NOT use shared administrator accounts for routine operations.
- MUST NOT leave standing privileged access where just-in-time elevation is feasible.
- MUST NOT disable logging or monitoring to complete privileged work.

## SHOULD
- Privileged sessions SHOULD be isolated from normal user activity.
- Sensitive elevation SHOULD require explicit reason or ticket reference.

## Exceptions
Emergency access requires break-glass controls, enhanced logging, immediate post-use review, named owner, and time-bounded credentials.

## Verification
Review privileged-role assignments, elevation logs, MFA policy, session records, approval evidence, and tests that normal identities cannot perform privileged operations.