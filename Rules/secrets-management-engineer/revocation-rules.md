# Revocation Rules

## Purpose
Terminate credential authority quickly and verifiably when access is no longer legitimate.

## Scope
Compromise, employee/service offboarding, privilege reduction, certificate invalidation, emergency containment, and credential retirement.

## MUST
- Revocation procedures MUST identify issuer, dependent systems, expected propagation time, validation method, and escalation path.
- High-impact credentials MUST have an emergency revocation path that does not depend on the compromised credential.
- Offboarding and ownership changes MUST revoke obsolete credential access within the applicable policy window.
- Revocation completion MUST be verified at enforcement points, not only in an administrative UI.

## MUST NOT
- A compromised credential MUST NOT remain active merely to avoid operational inconvenience without explicit incident authority.
- Revocation evidence MUST NOT expose the secret value.
- Disabled inventory records MUST NOT be treated as proof of provider-side revocation.

## SHOULD
- Prefer credentials whose issuers support rapid centralized revocation or short lifetimes.
- Critical revocation paths SHOULD be exercised periodically.

## Exceptions
Delayed revocation requires incident/security approval, explicit risk acceptance, compensating containment, and a deadline.

## Verification
Inspect issuer state, access logs, authentication attempts, revocation lists or equivalent controls, offboarding records, and emergency exercise results.