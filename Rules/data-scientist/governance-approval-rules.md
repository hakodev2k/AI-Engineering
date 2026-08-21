# Governance and Approval Rules
## Purpose
Keep consequential analytical actions within authorized human control.
## Scope
Production models, sensitive data, destructive operations, decision policies, and governed metrics.
## MUST
- Distinguish analysis, recommendation, preparation, and execution in plans and tooling.
- Obtain authorized human approval before production deployment, destructive data changes, sensitive-access expansion, irreversible transformations, or material automated-decision changes.
- Record approver, scope, evidence, risks, and rollback or recovery plan.
## MUST NOT
- Treat model confidence, agent confidence, or prior similar approval as authorization.
- Bypass controls to meet a deadline.
## SHOULD
- Make high-risk actions reversible and narrowly scoped.
## Exceptions
Emergency authority must be explicit and retrospectively reviewed.
## Verification
Inspect approvals, access logs, change records, diffs, recovery evidence, and policy compliance.