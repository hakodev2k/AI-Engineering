# Third-Party Identity Rules

## Purpose
Limit risk introduced by partners, vendors, guests, contractors, and external identity providers.

## Scope
Applies to guest users, business-to-business federation, vendor administrators, partner applications, and outsourced operators.

## MUST
- External access MUST have an internal sponsor or accountable owner.
- Third-party identities MUST receive only the resources and privileges required for the approved purpose.
- External access MUST have explicit review and termination criteria.
- Partner federation trust MUST document claim sources, assurance assumptions, and revocation behavior.
- High-impact third-party access MUST be monitored and periodically revalidated.

## MUST NOT
- External users MUST NOT inherit broad internal access merely through group nesting or default membership.
- Vendor administrative access MUST NOT remain enabled indefinitely after support activity ends.
- Unverified external claims MUST NOT map directly to privileged authorization.

## SHOULD
- Use time-bounded access for contractors and vendor support.
- Segment external identities from workforce identities in policy and reporting where practical.

## Exceptions
Exceptions require sponsor, business reason, scope, duration, risk assessment, and security approval.

## Verification
Inspect guest inventories, sponsor records, federation mappings, entitlement reviews, expiration settings, and vendor access logs.