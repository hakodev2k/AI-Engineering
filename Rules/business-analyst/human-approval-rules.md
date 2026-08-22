# Human Approval Rules

## Purpose
Prevent analysis or automation from exceeding delegated authority on high-risk business changes.
## Scope
Production-impacting changes, destructive actions, public contracts, pricing, security, access, data, and irreversible decisions.
## MUST
- Distinguish Analyze, Recommend, Prepare, and Execute authority for material actions.
- Obtain explicit accountable human approval before destructive data changes, breaking contracts, weakening controls, high-risk access changes, irreversible migrations, or other restricted actions.
- Record approver, scope, evidence, risk, and rollback or mitigation where applicable.
## MUST NOT
- Treat silence, urgency, tool capability, or model confidence as approval.
- Expand execution beyond the approved scope.
## SHOULD
- Prefer reversible, staged, and observable changes when risk is material.
## Exceptions
Emergency authority must be predefined, limited, auditable, and reviewed afterward.
## Verification
Inspect approval records, audit logs, scope, risk evidence, and proof that execution stayed within authorized boundaries.