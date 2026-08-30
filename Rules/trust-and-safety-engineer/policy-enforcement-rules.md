# Policy Enforcement Rules

## Purpose
Ensure automated and manual enforcement translates written policy into consistent, reviewable, proportionate system behavior.

## Scope
Applies to warnings, friction, content actions, feature restrictions, account actions, escalation, and enforcement reason codes.

## MUST
- Every enforcement action MUST map to a documented policy basis and reason code.
- Enforcement severity MUST be proportionate to harm, confidence, recurrence, and account or entity context.
- High-impact actions such as permanent suspension, irreversible deletion, or broad account restriction MUST require stronger evidence and review than low-impact interventions.
- Enforcement logic MUST define handling for uncertainty, conflicting signals, and unavailable evidence.
- Material policy-to-enforcement changes MUST be tested against representative positive, negative, edge, and historical cases before rollout.
- Systems MUST preserve sufficient evidence to explain why an action occurred, subject to privacy and retention requirements.

## MUST NOT
- MUST NOT silently expand policy scope through implementation details.
- MUST NOT apply irreversible enforcement solely because a weak or uncalibrated signal crosses a threshold.
- MUST NOT suppress or alter reason codes to hide uncertainty or implementation defects.
- MUST NOT weaken safety controls merely to improve engagement or reduce review volume without approved risk review.

## SHOULD
- Enforcement SHOULD prefer reversible or graduated interventions when they adequately control risk.
- Repeated behavior SHOULD be evaluated using documented recurrence logic rather than ad hoc reviewer judgment.
- Policy changes SHOULD include impact analysis for previously compliant users and creators.

## Exceptions
Emergency controls MAY temporarily use simplified enforcement paths when credible harm is imminent. The exception MUST record owner, rationale, duration, affected population, monitoring, and rollback conditions.

## Verification
Inspect policy mappings, enforcement configuration, test fixtures, sampled decisions, reason-code distributions, reversal rates, and rollout documentation. Review high-impact actions for evidence sufficiency and approval requirements.