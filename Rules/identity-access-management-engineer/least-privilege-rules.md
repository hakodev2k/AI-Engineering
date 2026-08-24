# Least Privilege Rules

## Purpose
Limit access to the minimum capability, scope, and duration required.

## Scope
Roles, groups, permissions, administrative access, service identities, emergency access, and delegated access.

## MUST
- New access MUST have a defined business purpose, owner, scope, and review or expiry condition.
- Privileged access MUST be separated from routine user access and time-bounded where feasible.
- Effective permissions MUST be evaluated, including inherited and transitive grants.
- Excess access identified by review or telemetry MUST be removed through a controlled process.

## MUST NOT
- MUST NOT use administrator roles as a default troubleshooting mechanism.
- MUST NOT preserve obsolete permissions solely because their impact is unknown; investigate and remediate safely.
- MUST NOT share privileged identities among operators.

## SHOULD
- Prefer just-in-time elevation and task-specific roles.
- Use access telemetry to refine privilege without compromising operational readiness.

## Exceptions
Exceptions require explicit risk acceptance, compensating controls, owner, expiry, and review cadence.

## Verification
Inspect effective-access reports, privilege assignments, elevation logs, stale-access findings, and review records.