# Privileged Access Rules

## Purpose
Constrain administrative access so high-impact privileges are temporary, strongly verified, attributable, and difficult to abuse.

## Scope
Applies to cloud administrators, infrastructure operators, database administrators, security administrators, production support, break-glass access, and other privileged identities.

## MUST
- Privileged access MUST use dedicated administrative identities or equivalent isolated privileged contexts separate from routine productivity access.
- High-impact administrative access MUST require strong authentication appropriate to the risk and SHOULD use phishing-resistant MFA where supported.
- Privileges MUST be least-privilege and time-bounded where just-in-time mechanisms are available.
- Privileged actions MUST be attributable to an individual or uniquely identified workload and MUST generate auditable records.
- Break-glass access MUST have narrowly scoped credentials, protected storage, monitored use, periodic testing, and post-use review.
- Privileged-role assignment, elevation, and emergency access MUST have explicit approval requirements proportional to impact.
- Administrative sessions for critical systems MUST have defined inactivity limits and revocation behavior.

## MUST NOT
- Shared privileged accounts MUST NOT be used for routine administration.
- Permanent broad administrator roles MUST NOT be granted solely to reduce operational friction.
- Privileged access MUST NOT rely on network location as its primary trust signal.
- Break-glass credentials MUST NOT be used as a substitute for normal privileged-access workflows.
- Administrative tooling MUST NOT bypass authorization or audit controls merely because the operator is trusted.

## SHOULD
- Privileged access SHOULD use hardened administrative workstations or isolated administrative environments for high-value systems.
- Sensitive administrative sessions SHOULD be recorded or otherwise captured with sufficient evidence for investigation where lawful and practical.
- Periodic access reviews SHOULD prioritize standing privileges and dormant administrative entitlements.

## Exceptions
Exceptions require exact privilege scope, business reason, risk, compensating controls, owner, expiration, and approval from the accountable security or system owner. Broad standing privilege requires explicit senior approval.

## Verification
Inspect privileged-role inventories, elevation workflows, MFA policy, session controls, break-glass procedures, audit logs, and access-review evidence. Test that expired or revoked elevations no longer authorize privileged actions.