# Access Reviews
## Purpose
Detect excessive, stale, and unjustified access.
## Scope
Periodic certification, entitlement review, and access recertification.
## MUST
- Reviewers MUST receive enough context to make an informed access decision.
- High-risk entitlements MUST be reviewed at a cadence proportional to impact.
- Revocation decisions MUST be tracked to effective removal, not merely approval.
- Review evidence MUST identify reviewer, decision, scope, and time.
## MUST NOT
- Review completion MUST NOT be inferred from non-response unless an explicitly approved deny-by-default workflow applies.
- Certification MUST NOT rely solely on opaque entitlement identifiers.
## SHOULD
- Prioritize anomalous, privileged, and unused access.
## Exceptions
Document unavailable evidence, risk, alternate validation, and owner approval.
## Verification
Sample certifications, trace removals to target systems, and inspect overdue-review metrics.