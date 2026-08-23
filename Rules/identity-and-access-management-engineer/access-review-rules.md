# Access Review Rules

## Purpose
Provide recurring evidence that granted access remains necessary, appropriate, and owned.

## Scope
User, service, privileged, application, group, and entitlement certifications.

## MUST
- Review scope and frequency MUST reflect privilege, data sensitivity, and regulatory requirements.
- Reviewers MUST have enough context to understand effective access and business need.
- Review outcomes MUST be attributable and retained as audit evidence.
- Revoked access MUST be removed within a defined remediation SLA.
- Unresolved or ambiguous certifications MUST be escalated rather than automatically approved.

## MUST NOT
- MUST NOT treat non-response as approval for high-risk access.
- MUST NOT certify only group membership when nested or inherited permissions materially change effective access.
- MUST NOT allow reviewers to approve their own high-risk access without independent oversight.

## SHOULD
- Review campaigns SHOULD prioritize toxic combinations, stale access, privilege, and anomalous grants.
- Repeated removals SHOULD trigger role or provisioning-design review.

## Exceptions
Any deferred remediation requires owner, reason, risk acceptance, compensating control, and expiry.

## Verification
Inspect campaign configuration, reviewer assignments, completion evidence, revocation tickets, SLA metrics, and samples of effective access before and after review.