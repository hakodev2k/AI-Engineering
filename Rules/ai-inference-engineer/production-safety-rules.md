# Production Safety Rules

## Purpose
Define Senior-level controls for dangerous inference-system actions and preserve human authority over production risk.

## Scope
Production deployments, destructive operations, infrastructure changes, secret rotation, access changes, breaking contracts, large migrations, and emergency actions.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as separate authority levels.
- Production deployment, infrastructure destruction, irreversible data deletion, secret rotation, high-risk access changes, and security-control reductions MUST require explicit human approval.
- Breaking public or internal serving contracts MUST require impact analysis, migration strategy, and approval before execution.
- Major runtime, accelerator, or dependency migrations MUST include compatibility evidence, staged rollout, and rollback plans.
- Production conclusions MUST be supported by observed logs, metrics, traces, tests, or equivalent operational evidence.
- Emergency actions MUST minimize blast radius and preserve an audit trail.

## MUST NOT
- MUST NOT force push or rewrite Git history to bypass review.
- MUST NOT execute destructive infrastructure or data operations without approved scope and recovery strategy.
- MUST NOT weaken authentication, authorization, isolation, or validation controls merely to unblock serving.
- MUST NOT claim an incident resolved before validating representative production behavior.
- An AI agent MUST NOT silently exceed granted production authority.

## SHOULD
- Prefer reversible changes and progressive exposure.
- Escalate when evidence is insufficient to distinguish safe remediation from high-risk experimentation.

## Exceptions
Emergency exceptions require authorized incident ownership, explicit rationale, bounded scope, verification, and post-incident review.

## Verification
Inspect approvals, audit logs, Git history, deployment records, rollback evidence, access changes, and post-change validation.