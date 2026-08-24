# Access Review Rules

## Purpose
Detect and remove access that is stale, excessive, orphaned, or no longer justified.

## Scope
Periodic certification, privileged reviews, entitlement ownership, inactive accounts, inherited access, and exception review.

## MUST
- Reviews MUST present effective access in enough context for reviewers to make informed decisions.
- High-risk and privileged access MUST be reviewed at a cadence appropriate to risk.
- Review decisions MUST be attributable and remediation MUST be tracked to completion.
- Unowned entitlements or identities MUST be treated as findings requiring resolution.

## MUST NOT
- MUST NOT treat bulk approval without meaningful evidence as a valid control.
- MUST NOT hide inherited or nested access from reviewers.
- MUST NOT leave revoked findings pending indefinitely.

## SHOULD
- Prioritize anomalous, unused, privileged, and cross-boundary access for deeper review.

## Exceptions
Deferred remediation requires documented risk, compensating controls, owner, deadline, and approval.

## Verification
Inspect certification records, reviewer evidence, effective-access snapshots, remediation latency, and recurrence of previously identified findings.