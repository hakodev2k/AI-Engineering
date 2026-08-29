# Access Control Rules

## Purpose
Restrict who and what can modify source, build systems, package registries, artifacts, and releases.

## Scope
Applies to human and workload identities across repositories, CI/CD, registries, artifact stores, signing services, and deployment systems.

## MUST
- Privileged access MUST follow least privilege and separation of duties appropriate to release risk.
- Administrative and publication permissions MUST have named owners and periodic review.
- Departed, transferred, or no-longer-required identities MUST lose access promptly.
- High-risk access changes MUST require explicit approval and produce audit evidence.

## MUST NOT
- MUST NOT use shared human accounts for privileged release activity.
- MUST NOT grant broad administrative access solely for convenience.
- MUST NOT allow dormant privileged accounts to remain enabled without justification.

## SHOULD
- Privileged access SHOULD be time-bounded or just-in-time where supported.
- Machine identities SHOULD be scoped to specific repositories, environments, and actions.

## Exceptions
Exceptions MUST document the access, reason, duration, compensating controls, risk, owner, and approval.

## Verification
Inspect identity inventories, group memberships, role assignments, access-review records, and audit logs. Confirm privileged permissions match current responsibilities.