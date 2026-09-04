# Resilience and Fail-Safe Rules

## Purpose
Keep Zero Trust controls secure and operable during dependency failure, partial outage, stale state, and recovery.

## Scope
Applies to identity providers, policy services, enforcement points, device and risk signals, certificate systems, directories, networks, and protected resources.

## MUST
- Each critical access path MUST document which dependencies can fail and the resulting access behavior for each failure mode.
- Fail-open versus fail-closed behavior MUST be chosen explicitly by resource and action risk, not inherited accidentally from product defaults.
- High-risk administrative and destructive operations MUST default to denial when required identity or policy evidence cannot be validated, except for controlled emergency access.
- Critical policy and identity dependencies MUST have availability, recovery, and capacity objectives consistent with the systems that depend on them.
- Cached credentials, claims, policies, and decisions used during degraded operation MUST have bounded lifetime and documented revocation implications.
- Emergency-access mechanisms MUST be independent enough to remain usable during plausible primary-control outages while remaining strongly protected and auditable.
- Recovery procedures MUST verify policy synchronization and control health before declaring normal trust decisions restored.

## MUST NOT
- Dependency failure MUST NOT silently produce broader access than the documented degraded-mode policy.
- Resilience design MUST NOT create a universal bypass credential or permanently trusted network path.
- Availability pressure MUST NOT justify indefinite use of stale authorization state.
- A resilience mechanism MUST NOT be considered safe without testing both availability and security consequences.

## SHOULD
- Critical control planes SHOULD be redundant across failure domains where justified by business impact.
- Degraded modes SHOULD preserve the minimum necessary business capability rather than full normal privilege.
- Failure-injection and recovery exercises SHOULD validate policy behavior before high-impact deployments.

## Exceptions
Exceptions require affected resources, failure scenario, business need, security and availability risk, compensating controls, owner, expiry where relevant, and approval by accountable security and service owners.

## Verification
Inspect dependency maps, timeout and cache settings, fail-open/fail-closed configuration, recovery objectives, emergency-access procedures, outage exercises, and failure-injection results. Confirm documented degraded behavior matches observed enforcement.