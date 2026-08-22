# Human Approval Rules
## Purpose
Prevent AI systems and agents from silently exceeding delegated authority.
## Scope
Production changes, destructive actions, sensitive data, security controls, public contracts, access changes, and irreversible side effects.
## MUST
- Distinguish Analyze, Recommend, Prepare, and Execute permissions explicitly for high-impact workflows.
- Require authorized human approval before destructive, irreversible, security-weakening, privileged, or production-impacting actions when policy requires it.
- Present the proposed action, scope, expected impact, risks, and rollback or recovery information before approval.
- Revalidate approval if the material action changes after approval.
## MUST NOT
- Infer approval from silence, prior unrelated consent, or model confidence.
- Allow an AI agent to broaden its own permissions or approval scope.
## SHOULD
- Use auditable approval records and narrow, time-bounded execution grants.
## Exceptions
Only explicitly pre-authorized low-risk actions may execute without per-action approval, within documented limits.
## Verification
Inspect permission models, approval logs, negative tests, scope checks, and high-risk action simulations.