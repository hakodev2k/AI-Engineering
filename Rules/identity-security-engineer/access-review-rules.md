# Access Review Rules

## Purpose
Detect excessive, stale, conflicting, or unjustified access through evidence-based periodic review.

## Scope
Applies to privileged roles, sensitive applications, high-impact groups, external users, and long-lived access grants.

## MUST
- Access reviews MUST identify the accountable reviewer, scope, decision criteria, and completion deadline.
- Reviewers MUST have enough business and technical context to judge continued need.
- Revoked access MUST be removed and verified, not merely marked for removal.
- Privileged and high-risk access MUST be reviewed more frequently than low-impact access.
- Review evidence MUST be retained according to governance requirements.

## MUST NOT
- Access reviews MUST NOT be satisfied by automatic approval of unchanged memberships.
- Reviewers MUST NOT approve access they cannot understand without escalation or clarification.
- Stale review campaigns MUST NOT be treated as evidence of compliance.

## SHOULD
- Reviews SHOULD prioritize anomalies such as dormant users, conflicting roles, privilege accumulation, and external identities.
- Repeatedly reapproved exceptions SHOULD trigger redesign of the underlying entitlement model.

## Exceptions
Exceptions require documented reason, reviewer, risk, compensating control, and expiration or next review date.

## Verification
Inspect completed campaigns, revocation evidence, reviewer assignments, sampling results, exception records, and overdue-review metrics.