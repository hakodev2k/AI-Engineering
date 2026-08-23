# Third-Party Access Rules

## Purpose
Limit and govern access granted to vendors, contractors, partners, and other external identities.

## Scope
Guest identities, B2B federation, contractor accounts, vendor support access, and externally managed principals.

## MUST
- Third-party access MUST have an internal sponsor, business purpose, approved scope, and expiry or review date.
- External identities MUST be distinguishable from workforce identities in governance and reporting.
- Privileged third-party access MUST be time-bounded and independently approved.
- Federation with external identity providers MUST define trust ownership, assurance requirements, and termination behavior.
- Access MUST be removed promptly when the contract, engagement, or support need ends.

## MUST NOT
- MUST NOT grant persistent broad access because a vendor may need it later.
- MUST NOT allow external users to approve their own access or exception renewals.
- MUST NOT assume the external organization's lifecycle process satisfies internal deprovisioning requirements.

## SHOULD
- Vendor support access SHOULD use just-in-time elevation and monitored sessions where practical.
- External-access reviews SHOULD prioritize sensitive systems and stale sponsorship.

## Exceptions
Require internal owner, reason, risk, compensating controls, independent approval, and expiry.

## Verification
Inspect guest inventory, sponsorship, expiry settings, federation configuration, privileged-session evidence, access reviews, and terminated-engagement samples.