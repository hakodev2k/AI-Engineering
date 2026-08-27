# Privileged Access
## Purpose
Control identities capable of high-impact administrative actions.
## Scope
Administrative roles, privileged accounts, elevation, and emergency access.
## MUST
- Privileged access MUST be separately identifiable, least-privileged, strongly authenticated, and auditable.
- Standing privilege MUST be justified; time-bound elevation MUST be used where operationally viable.
- Emergency access MUST have controlled custody, monitoring, testing, and post-use review.
## MUST NOT
- Shared privileged credentials MUST NOT be used without a controlled system that preserves attribution.
- Privilege MUST NOT be granted solely for convenience.
## SHOULD
- Separate routine and administrative identities.
## Exceptions
Require risk acceptance, owner, duration, controls, and security approval.
## Verification
Review role assignments, elevation logs, emergency-account tests, access reviews, and authentication policy.