# Fairness and Exposure Rules

## Purpose
Control distributional effects so recommendation exposure is measurable, explainable, and consistent with approved product and policy goals.

## Scope
Applies to creator, seller, item, demographic, geographic, and catalog exposure patterns when fairness or allocation concerns are relevant.

## MUST
- Fairness objectives MUST name the protected or monitored population, metric, acceptable range, and business or policy rationale.
- Exposure changes MUST be evaluated for both recipient utility and supplier-side distributional impact where applicable.
- Fairness constraints MUST be implemented separately from undocumented manual preference rules.
- Material disparities MUST be investigated using segment-aware evidence before broad rollout.
- Any use of sensitive attributes for fairness analysis or mitigation MUST have explicit authorization and privacy controls.

## MUST NOT
- MUST NOT claim fairness from aggregate averages that hide material subgroup harm.
- MUST NOT use sensitive attributes outside their authorized analytical or mitigation purpose.
- MUST NOT weaken safety, fraud, or legal constraints to satisfy exposure targets.

## SHOULD
- Fairness metrics SHOULD be paired with relevance and quality metrics to reveal trade-offs.
- Mitigations SHOULD prefer auditable, reversible mechanisms.

## Exceptions
Exceptions require documented rationale, impact analysis, legal or policy review when relevant, and explicit approval.

## Verification
Review metric definitions, subgroup reports, feature access controls, mitigation configuration, experiment results, and approval records.