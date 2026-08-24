# Release Readiness Rules

## Purpose
Ensure launches and major transitions proceed only with explicit readiness evidence.

## Scope
Production releases, migrations, cutovers, platform changes, and externally visible launches.

## MUST
- Release criteria MUST include technical, operational, support, security, and rollback readiness where relevant.
- Launch decisions MUST identify unresolved risks, owners, and acceptance authority.
- Rollback or contingency plans MUST be validated for material changes.
- Required runbooks and support ownership MUST exist before release.

## MUST NOT
- MUST NOT treat schedule pressure as sufficient evidence of readiness.
- MUST NOT proceed with unresolved critical blockers without authorized acceptance.

## SHOULD
- Readiness reviews SHOULD use a standard evidence checklist.
- High-risk launches SHOULD include staged rollout or progressive exposure when feasible.

## Exceptions
Exceptions require rationale, residual risk, contingency, owner, and explicit approval.

## Verification
Inspect readiness checklists, validation evidence, rollback plans, support handoffs, and launch approvals.