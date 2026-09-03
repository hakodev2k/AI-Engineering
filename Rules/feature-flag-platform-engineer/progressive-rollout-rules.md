# Progressive Rollout Rules

## Purpose
Limit blast radius while releasing behavior through feature flags.

## Scope
Applies to canary exposure, percentage rollout, cohort expansion, and staged activation.

## MUST
- Progressive rollouts MUST define entry criteria, health signals, stop conditions, and rollback action before expansion.
- Expansion MUST proceed in bounded stages appropriate to expected risk and impact.
- Rollout decisions MUST use observed production evidence rather than elapsed time alone.
- High-risk rollout stages MUST have an identified decision owner.
- The platform MUST support reducing or disabling exposure without application redeployment for flags used as release controls.

## MUST NOT
- MUST NOT move directly from no exposure to broad production exposure for high-risk changes without documented justification.
- MUST NOT continue expansion while defined guardrails are breached.
- MUST NOT change allocation logic mid-rollout without evaluating cohort stability.

## SHOULD
- Rollout stages SHOULD align with tenant, region, or traffic boundaries when those boundaries reduce risk.

## Exceptions
Low-risk or non-production changes may use simplified rollout steps with documented rationale.

## Verification
Inspect rollout plans, exposure history, guardrail metrics, decision logs, and rollback tests.