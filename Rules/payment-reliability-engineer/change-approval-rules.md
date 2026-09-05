# Change Approval Rules

## Purpose
Define authority boundaries for actions that can move money, alter financial truth, weaken controls, or affect production payment behavior.

## Scope
Production deployment, manual payment correction, destructive data change, provider routing, secret rotation, access change, schema migration, and security-control modification.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Production deployment, destructive SQL, manual financial adjustment, irreversible migration, provider rerouting with material impact, secret rotation, and high-risk access changes MUST require explicit human approval.
- Approval evidence MUST identify the requested action, scope, risk, and authorized approver.
- High-risk execution MUST include verification and a rollback or compensating plan where technically possible.
- Emergency actions MUST follow defined incident authority and remain auditable.

## MUST NOT
- MUST NOT infer approval from silence, prior approval of a different action, or agent confidence.
- MUST NOT weaken security, fraud, reconciliation, or audit controls merely to unblock implementation.
- MUST NOT perform force push, history rewriting, destructive data deletion, or irreversible financial correction without explicit authorization.

## SHOULD
- Prefer reversible, narrowly scoped changes and two-person review for financially material manual actions.

## Exceptions
No exception may silently exceed delegated authority; emergency authority must be explicit and documented.

## Verification
Inspect approval records, audit logs, Git history, database change records, production deployment logs, and post-change verification evidence.