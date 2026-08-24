# Access Request Rules

## Purpose
Make access grants intentional, justified, attributable, and reviewable.

## Scope
User access requests, group membership, role assignment, delegated approvals, temporary access, and exceptions.

## MUST
- Access requests MUST state requester, target identity, requested entitlement, business purpose, scope, and duration where applicable.
- Approval MUST come from an accountable authority independent of the requester for sensitive access.
- Provisioning MUST match the approved entitlement exactly and produce an auditable result.
- Rejected, expired, and withdrawn requests MUST not result in active access.

## MUST NOT
- MUST NOT accept blanket approvals for undefined future privilege.
- MUST NOT use approval as a substitute for prohibited toxic access combinations.
- MUST NOT allow requesters to self-approve privileged access.

## SHOULD
- Prefer cataloged entitlements with clear descriptions, owners, risk tiers, and default durations.

## Exceptions
Emergency grants require incident or emergency justification, narrow scope, expiry, monitoring, and retrospective review.

## Verification
Sample request-to-grant chains, compare approvals with effective access, test expiry, and inspect segregation of approval duties.