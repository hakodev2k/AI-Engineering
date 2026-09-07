# Rollback and Recovery Rules

## Purpose
Ensure every material release has a realistic path to restore acceptable service when deployment or activation causes harm.

## Scope
Applies to rollback, roll-forward, traffic shift, feature disablement, restore, and containment procedures.

## MUST
- Each material release MUST define recovery triggers, decision authority, steps, owners, dependencies, expected duration, and verification criteria.
- Recovery plans MUST account for data/schema compatibility, irreversible side effects, queued work, caches, external integrations, and configuration changes where relevant.
- Recovery procedures MUST be validated in a representative environment or supported by equivalent evidence before high-risk releases.
- The point beyond which simple rollback is unsafe or impossible MUST be identified before execution.
- Recovery completion MUST be verified by service health and business-impact signals, not deployment status alone.

## MUST NOT
- “Redeploy the previous version” MUST NOT be considered a complete rollback plan when stateful or external effects exist.
- Destructive recovery actions MUST NOT execute without the required human approval.
- A failed rollback MUST NOT trigger improvised high-risk changes without reassessment and authority.

## SHOULD
- Recovery SHOULD favor bounded, rehearsed, automatable procedures.
- Roll-forward SHOULD be preferred only when evidence shows it is safer and faster than rollback or containment.

## Exceptions
If rollback is technically impossible, the release requires documented containment and roll-forward plans, explicit residual-risk acceptance, and higher-level approval appropriate to impact.

## Verification
Review runbooks, tests or drills, compatibility evidence, recovery timing, trigger thresholds, ownership, approvals, and post-recovery health checks.