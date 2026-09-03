# Identity and Access Review Rules

## Purpose
Ensure access remains authorized, necessary, traceable, and periodically revalidated.

## Scope
Applies to workforce, service, third-party, emergency, and machine identities with access to in-scope systems or data.

## MUST
- Access reviews MUST use authoritative identity and entitlement data and identify the responsible reviewer.
- Reviewers MUST validate continued business need, role appropriateness, privilege level, and ownership.
- Terminated, transferred, dormant, orphaned, or unexplained access MUST be investigated and removed or explicitly reapproved.
- Review completion and remediation MUST be evidenced.

## MUST NOT
- Reviewers MUST NOT approve access they cannot understand or validate.
- Bulk approval without inspecting material entitlements MUST NOT be accepted as effective review.
- Stale accounts MUST NOT remain active solely because ownership is unclear.

## SHOULD
- Prioritize high-risk privileges and sensitive-data access for more frequent review.
- Automate reconciliation between identity sources and target systems.

## Exceptions
Delayed revocation requires documented risk, compensating controls, owner, deadline, and approval.

## Verification
Sample review records, compare source identities to system entitlements, inspect revocation evidence, and test reviewer independence.