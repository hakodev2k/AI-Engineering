# Production Approval Rules
## Purpose
Keep chaos automation within authorized production boundaries.
## Scope
Production fault injection and high-risk actions.
## MUST
- Distinguish analyze, recommend, prepare, and execute.
- Obtain authorized human approval before production fault injection, destructive actions, security-control weakening, infrastructure destruction, or high-risk configuration/access changes.
- Present scope, evidence, blast radius, abort criteria, recovery, and exact action for approval.
## MUST NOT
- Treat permission to design an experiment as permission to execute it.
- Reuse approval after material scope changes.
## SHOULD
- Encode approval boundaries in IAM and experiment tooling.
## Exceptions
Pre-authorized game-day procedures may delegate bounded actions to named roles.
## Verification
Inspect approvals, target scope, IAM, audit logs, and executed parameters.