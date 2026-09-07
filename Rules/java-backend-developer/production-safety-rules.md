# Production Safety Rules

## Purpose
Control high-impact actions and make Java backend changes recoverable in production.

## Scope
Applies to deployments, runtime changes, data operations, maintenance, and emergency actions.

## MUST
- Production changes MUST define expected impact, verification signals, failure criteria, and rollback or containment path.
- Destructive SQL, data deletion, irreversible migrations, secret rotation, breaking public contracts, security weakening, and high-risk access changes MUST require explicit human approval before execution.
- AI-assisted work MUST distinguish analysis, recommendation, preparation, and execution and MUST NOT exceed granted authority.
- Deployments MUST be observable by version and correlated with service health.
- Emergency actions MUST be recorded sufficiently for later reconstruction.

## MUST NOT
- MUST NOT force push or rewrite shared protected history without explicit authorization.
- MUST NOT execute destructive production actions merely because a command was generated successfully.
- MUST NOT continue rollout after defined safety thresholds are breached without authorized reassessment.

## SHOULD
- Prefer staged, canary, reversible, and feature-controlled releases where risk warrants them.
- Automate repeatable safety checks.

## Exceptions
Immediate incident containment may shorten normal process only under designated incident authority and must retain evidence and retrospective review.

## Verification
Inspect approvals, deployment records, diffs, runbooks, rollback evidence, monitoring, audit logs, and post-change health checks.