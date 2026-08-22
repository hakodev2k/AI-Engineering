# Store Policy Compliance Rules
## Purpose
Prevent avoidable rejection, removal, or user harm from mobile store and platform-policy violations.
## Scope
Store policies, payments, privacy disclosures, permissions, account deletion, background modes, and restricted APIs.
## MUST
- Features subject to store/platform policy MUST be checked against current authoritative requirements before release.
- Declared permissions, data practices, payment behavior, and account-management capabilities MUST match shipped behavior.
- Policy-sensitive changes MUST have an owner and release evidence.
## MUST NOT
- Review circumvention, hidden behavior, or misleading metadata MUST NOT be used to obtain approval.
- A previously accepted build MUST NOT be treated as proof that new behavior remains compliant.
## SHOULD
- High-risk policy areas SHOULD be reviewed early in product design rather than at submission.
## Exceptions
Ambiguous policy interpretation requires documented rationale and, when material, legal/compliance or platform review.
## Verification
Compare current store declarations and product behavior against authoritative policy, submission artifacts, and review feedback.