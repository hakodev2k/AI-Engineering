# Capacity SLO Rules
## Purpose
Connect capacity decisions to user-visible reliability objectives.
## Scope
Service objectives, saturation thresholds, error budgets, and capacity risk.
## MUST
- Capacity thresholds for critical services MUST be tied to measurable service degradation or failure risk.
- Plans MUST identify which SLOs can be violated when a modeled limit is reached.
- Capacity incidents MUST feed back into threshold and model review.
## MUST NOT
- MUST NOT define capacity health solely as resource utilization below an arbitrary percentage.
- MUST NOT claim sufficient capacity when load tests violate required service objectives.
## SHOULD
- Capacity risk SHOULD be prioritized using user impact and time-to-limit.
## Exceptions
Services without formal SLOs require explicit operational targets.
## Verification
Review SLO dashboards, saturation correlations, tests, and incident records.