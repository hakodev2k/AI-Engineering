# Access Governance Rules

## Purpose
Ensure privileged and compliance-sensitive access is authorized, limited, reviewable, and revocable.

## Scope
Applies to application, infrastructure, data, administrative, audit, and support access.

## MUST
- Access MUST be granted on documented role or task need and reviewed at a frequency appropriate to risk.
- Privileged access MUST use stronger authentication and tighter approval than ordinary access.
- Departed or transferred users MUST have access removed or revalidated promptly.
- Emergency access MUST be time-bounded and auditable.

## MUST NOT
- MUST NOT use shared accounts where individual accountability is required and technically feasible.
- MUST NOT retain standing privilege solely for convenience.

## SHOULD
- Prefer just-in-time and role-based access for sensitive systems.

## Exceptions
Exceptions require owner, scope, duration, reason, monitoring, and approval.

## Verification
Inspect identity records, entitlement reviews, authentication policy, privileged-access logs, and revocation evidence.