# Deployment and Rollback Rules

## Purpose
Keep payment releases reversible, progressively validated, and safe for in-flight financial operations.

## Scope
Application releases, database changes, provider configuration, feature flags, routing, and payment-processing workers.

## MUST
- Production deployment MUST require the defined human approval for the environment and risk level.
- High-risk payment changes MUST use progressive exposure or an equivalent blast-radius control when practical.
- Rollback or forward-recovery behavior MUST be defined before deployment, including treatment of in-flight transactions.
- Database and contract changes MUST remain compatible across the deployment window or use an approved migration strategy.
- Post-deployment verification MUST include financial outcome and reconciliation signals, not only infrastructure health.

## MUST NOT
- MUST NOT deploy irreversible financial-state changes without explicit approval and recovery planning.
- MUST NOT force push or rewrite Git history to alter release evidence.
- MUST NOT remove the previous deployable version before the rollback window closes.

## SHOULD
- Separate provider routing and feature activation from binary deployment where that improves reversibility.

## Exceptions
Emergency changes require incident authority, minimized scope, audit trail, and post-change review.

## Verification
Review approvals, diffs, rollout gates, migration compatibility, rollback drills, and post-release metrics.