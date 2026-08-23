# Production Change Approval Rules
## Purpose
Keep observability automation within authorized operational boundaries.
## Scope
Production agents, collectors, access, retention, routing, sampling, and security controls.
## MUST
- Distinguish analysis, recommendation, preparation, and execution.
- Obtain human approval before high-risk production configuration changes, destructive telemetry deletion, security-control weakening, privileged access changes, or changes capable of materially impairing production observability.
- Present scope, evidence, risk, recovery, and exact intended action for approval.
- Verify approval still matches the current change.
## MUST NOT
- Treat permission to investigate as permission to modify production.
- Force changes through after material scope changes without renewed approval.
## SHOULD
- Encode approval boundaries in IAM and deployment pipelines.
## Exceptions
Pre-authorized incident procedures may delegate bounded actions to designated responders.
## Verification
Inspect approvals, diffs, IAM/pipeline gates, audit logs, and recovery evidence.