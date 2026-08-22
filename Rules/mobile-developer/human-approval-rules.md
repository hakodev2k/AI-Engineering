# Human Approval Rules
## Purpose
Keep high-impact mobile actions within explicit human authority.
## Scope
Production release, signing, destructive data behavior, security weakening, privacy changes, breaking contracts, and irreversible actions.
## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Production release, signing-credential changes, destructive user-data changes, weakened security controls, material privacy expansion, and breaking backend/client contracts MUST require authorized human approval when the actor is an AI agent or lacks delegated authority.
- Approval evidence MUST identify action, scope, risk, and approver.
## MUST NOT
- An agent MUST NOT infer approval from urgency, silence, prior unrelated approval, or technical capability.
- Force push, history rewriting, destructive infrastructure/data actions, or secret rotation MUST NOT be executed without explicit authority.
## SHOULD
- High-risk changes SHOULD be designed for reversibility and staged exposure.
## Exceptions
Pre-authorized runbooks may permit bounded execution when scope, conditions, rollback, and auditability are explicit.
## Verification
Inspect change records, approvals, CI/CD permissions, audit logs, and executed scope against authorized scope.