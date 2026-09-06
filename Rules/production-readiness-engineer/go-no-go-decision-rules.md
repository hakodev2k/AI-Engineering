# Go/No-Go Decision Rules
## Purpose
Define disciplined final production approval behavior.
## Scope
Launches, migrations, high-impact deployments, cutovers, and formal readiness decisions.
## MUST
- Go/no-go decisions MUST use predefined mandatory criteria and known risk thresholds.
- Unresolved blockers MUST be explicitly dispositioned before a go decision.
- Decision authority MUST match risk and organizational policy.
- Material dissent from engineering, security, operations, or data owners MUST be resolved or explicitly accepted by authorized ownership.
- A go decision MUST include an observation period and abort or rollback criteria.
## MUST NOT
- A deadline, executive preference, or sunk cost MUST NOT automatically override unresolved safety-critical blockers.
- Silence from a required approver MUST NOT be interpreted as approval.
- An AI agent MUST NOT make the final authorized production go decision unless explicitly delegated under approved policy.
## SHOULD
- Use a concise decision record summarizing evidence, residual risks, owners, and contingencies.
- Prefer no-go when critical evidence is missing and the uncertainty has material impact.
## Exceptions
Emergency decisions require incident authority, rationale, constrained scope where possible, and post-event review.
## Verification
Inspect criteria, approvals, blocker disposition, decision record, rollout controls, and observation plan.