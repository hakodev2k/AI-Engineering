# Human-in-the-Loop Rules
## Purpose
Place human judgment at decision points where automation risk is unacceptable.
## Scope
Approvals, escalations, review queues, and operator intervention.
## MUST
- Define which decisions require human review and what evidence the reviewer receives.
- Preserve the exact proposed action until approval or require re-approval if material inputs change.
- Provide operators a safe reject, cancel, or rollback path where feasible.
## MUST NOT
- Use misleading interfaces that encourage blind approval.
- Execute a materially changed action under stale approval.
## SHOULD
- Prioritize human review by risk and provide concise decision-relevant context.
## Exceptions
Pre-approved low-risk actions require explicit policy boundaries and auditability.
## Verification
Inspect approval workflows, stale-approval tests, audit trails, and operator usability evidence.