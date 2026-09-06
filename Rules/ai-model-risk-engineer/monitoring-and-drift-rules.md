# Monitoring and Drift Rules

## Purpose
Detect when model behavior, inputs, outputs, dependencies, or use patterns move outside validated assumptions.

## Scope
Applies to post-deployment monitoring of performance, behavior, safety controls, data distributions, user populations, and model dependencies.

## MUST
- Production monitoring MUST cover the material risks identified during validation.
- Drift thresholds MUST be tied to investigation or mitigation actions rather than collected as unused telemetry.
- Monitoring MUST distinguish model-quality degradation from infrastructure or integration failures where practical.
- High-risk models MUST define escalation criteria for material behavioral drift or control failure.
- Monitoring changes that reduce visibility into critical risks MUST receive review.

## MUST NOT
- Teams MUST NOT infer model safety from service availability alone.
- Drift alerts MUST NOT be disabled solely because they are inconvenient without documented tuning evidence.

## SHOULD
- Monitoring SHOULD compare production slices with validated baselines where privacy and data quality permit.
- Teams SHOULD periodically reassess whether monitored signals still represent the most material risks.

## Exceptions
When direct monitoring is not feasible, document proxy indicators, blind spots, compensating controls, residual risk, and owner.

## Verification
Inspect dashboards, alert rules, baseline definitions, incident records, threshold changes, and sampled production telemetry.