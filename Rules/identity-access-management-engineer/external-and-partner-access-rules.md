# External and Partner Access Rules

## Purpose
Control identities outside the primary organization or trust domain without granting accidental internal equivalence.

## Scope
Guests, vendors, partners, contractors, B2B federation, delegated administration, and cross-tenant access.

## MUST
- External identities MUST be distinguishable from internal identities in policy and audit evidence.
- Sponsorship, ownership, purpose, access scope, and expiry or review cadence MUST be defined.
- Federation or invitation flows MUST constrain tenant, issuer, claims, and resource access as appropriate.
- Sensitive partner access MUST be reassessed when contracts, sponsors, or trust relationships change.

## MUST NOT
- MUST NOT map external membership to privileged internal roles without explicit controlled policy.
- MUST NOT allow abandoned guest identities to retain indefinite access.
- MUST NOT assume a partner's authentication assurance equals internal assurance without evidence.

## SHOULD
- Prefer federation over duplicate unmanaged credentials when assurance and lifecycle controls are sufficient.

## Exceptions
Extended external access requires business justification, owner, risk review, compensating controls, and approval.

## Verification
Inspect external identity inventory, sponsor status, trust configuration, expiry enforcement, effective access, and review records.