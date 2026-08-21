# Production Change Approval Rules
## Purpose
Control high-risk changes to production systems, data, access, and public contracts.
## Scope
Deployments, destructive operations, irreversible migrations, security controls, secrets, infrastructure, and contract breaks.
## MUST
- Require authorized human approval for destructive, irreversible, security-weakening, access-sensitive, or breaking production actions.
- Ensure high-risk changes have validation, rollback or recovery strategy, owner, and monitoring plan.
- Distinguish analysis, recommendation, preparation, approval, and execution authority.
## MUST NOT
- Allow an AI agent or engineer to silently exceed granted execution authority.
- Approve force pushes, destructive SQL, infrastructure deletion, or security weakening without explicit risk review.
## SHOULD
- Prefer staged, reversible rollout mechanisms.
## Exceptions
Emergency execution requires incident authority and retrospective review.
## Verification
Inspect approvals, change records, deployment evidence, audit logs, and rollback readiness.