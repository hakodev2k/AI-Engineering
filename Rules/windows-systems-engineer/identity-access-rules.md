# Identity and Access

## Purpose
Protect Windows identities, privileged access, and administrative boundaries.

## Scope
Active Directory or local identities, groups, service accounts, privileged sessions, and delegated administration.

## MUST
- Administrative access MUST use named, attributable identities and least privilege.
- Privileged group membership MUST have an owner, business justification, and periodic review.
- Service identities MUST have documented purpose, scoped permissions, and managed credential lifecycle.
- Emergency access MUST be auditable, time-bounded where practical, and reviewed after use.
- Changes to domain-wide privilege MUST receive human approval before execution.

## MUST NOT
- MUST NOT share administrator credentials or use personal accounts for unattended services.
- MUST NOT grant Domain Admin or equivalent privilege merely to solve application permission issues.
- MUST NOT disable authentication controls to bypass operational failures.

## SHOULD
- Separate daily-use and privileged identities.
- Prefer managed service identities and just-in-time privilege where supported.
- Remove stale memberships promptly after ownership validation.

## Exceptions
Exceptions require documented reason, affected identities, duration, compensating controls, risk, and approver.

## Verification
Review group membership, effective permissions, authentication logs, identity configuration, access reviews, and change records. Validate high-risk changes in a representative non-production environment when feasible.