# Progressive Rollout Rules

## Purpose
Limit blast radius while increasing exposure using observable gates.

## Scope
Percentage, cohort, region, tenant, and staged production rollouts.

## MUST
- Materially risky changes MUST begin with bounded exposure unless emergency conditions justify otherwise.
- Rollout stages MUST define entry criteria, health signals, hold periods when relevant, and abort thresholds.
- Exposure increases MUST use current production evidence.
- Rollback or disable procedure MUST be known before rollout starts.

## MUST NOT
- Rollout MUST NOT advance solely because elapsed time passed.
- Operators MUST NOT expand exposure while critical health signals are unknown or materially degraded.
- Percentage changes MUST NOT be mistaken for deterministic cohort changes unless allocation semantics guarantee it.

## SHOULD
- Early stages SHOULD include representative internal or low-risk cohorts.
- Automation SHOULD stop progression on breached guardrails.

## Exceptions
Emergency rollout requires incident or change authority, documented rationale, and post-action review.

## Verification
Inspect rollout plans, telemetry, change history, guardrail configuration, and rollback evidence.