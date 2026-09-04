# Policy Exception and Waiver Rules

## Purpose
Prevent policy exceptions from becoming unbounded, invisible, or permanent control bypasses.

## Scope
Applies to waivers, exemptions, suppressions, risk acceptances, break-glass bypasses, and temporary deviations from enforced policy.

## MUST
- Every exception MUST identify the violated control, bounded subject or resource scope, business reason, accountable owner, approver, creation time, and expiry.
- Security-sensitive exceptions MUST document risk and compensating controls.
- Exception matching MUST be narrowly defined using stable identifiers where practical.
- Expired exceptions MUST cease to authorize bypass automatically.
- Exception use MUST be auditable and attributable to the policy decision that consumed it.
- Recurring exceptions MUST trigger review of either the underlying system or the policy requirement.

## MUST NOT
- Exceptions MUST NOT use unrestricted wildcards merely for convenience.
- An exception MUST NOT silently disable unrelated policy controls.
- Permanent exceptions MUST NOT be disguised by repeated automatic renewal.
- Agents or automated systems MUST NOT approve their own high-risk exceptions unless explicitly authorized by governance design.

## SHOULD
- Exception inventories SHOULD be reviewed periodically for concentration, age, and repeated causes.
- Low-risk exceptions SHOULD still use machine-verifiable scope and expiry.

## Exceptions
A non-expiring waiver requires explicit risk ownership, documented reason why expiry is unsuitable, periodic review, and approval at the level required by the affected control.

## Verification
Inspect exception records, scope matching, expiry tests, decision logs, approval evidence, and reports of active/expired waivers. Attempt representative out-of-scope use to prove an exception cannot bypass broader controls.