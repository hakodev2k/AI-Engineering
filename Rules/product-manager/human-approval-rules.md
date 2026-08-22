# Human Approval Rules
## Purpose
Prevent product or AI-assisted workflows from silently exceeding authority on high-risk decisions.
## Scope
Production-impacting changes, public contracts, pricing, data handling, security controls, irreversible actions, and high-risk customer commitments.
## MUST
- Distinguish Analyze, Recommend, Prepare, and Execute authority for significant product actions.
- Obtain accountable human approval before executing breaking public-contract changes, destructive data actions, irreversible migrations, material pricing changes, weakened security controls, high-risk access changes, or other explicitly restricted actions.
- Record approver, scope, evidence, risk, and rollback or mitigation plan where applicable.
## MUST NOT
- Treat model confidence, urgency, or stakeholder pressure as approval.
- Expand execution scope beyond what was explicitly approved.
## SHOULD
- Prefer reversible and staged actions for high-impact changes.
## Exceptions
Emergency authority must be predefined, limited in scope, auditable, and reviewed afterward.
## Verification
Inspect approval records, audit logs, change scope, rollback plans, access controls, and evidence that execution matched authorized boundaries.