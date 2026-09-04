# Mitigation Priority Rules

## Purpose
Prioritize reduction of active impact over premature root-cause work.

## Scope
Applies while production impact or material operational risk is ongoing.

## MUST
- Prioritize actions that safely reduce customer, data, security, or business impact.
- Prefer reversible mitigations when they can restore service with acceptable risk.
- Evaluate each mitigation for blast radius, rollback path, dependencies, and expected signal.
- Assign owners and expected observation windows to major mitigations.
- Re-evaluate strategy if a mitigation fails to produce the expected evidence.

## MUST NOT
- Delay an available safe mitigation solely to prove root cause first.
- Stack multiple high-impact changes without enough observability to distinguish effects.
- Continue a mitigation after evidence shows worsening impact without reassessment.

## SHOULD
- Separate stabilization from permanent remediation.
- Sequence changes so each produces interpretable evidence where urgency permits.

## Exceptions
Immediate safety or containment needs may justify less reversible action with explicit approval and documented risk.

## Verification
Review the timeline, change records, telemetry, and rollback notes for impact-first prioritization and evidence after each major mitigation.