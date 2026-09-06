# Feature Freshness Rules

## Purpose
Ensure consumers receive feature values recent enough for their business and model requirements.

## Scope
Freshness definitions, source lag, materialization lag, serving age, and stale-value behavior.

## MUST
- Each time-sensitive production feature MUST define a measurable freshness objective.
- Freshness MUST be measured from the business-relevant source timestamp, not only pipeline completion time.
- Materialization lag and source lag MUST be observable separately where useful.
- Stale-value behavior MUST be explicit for online serving.
- Freshness breaches affecting model correctness MUST trigger actionable alerting.

## MUST NOT
- MUST NOT declare a feature fresh solely because the pipeline ran successfully.
- MUST NOT hide stale values behind default timestamps.
- MUST NOT relax freshness objectives without consumer impact analysis.

## SHOULD
- Use different freshness objectives for feature classes when their semantics differ.
- Track distributions, not only average lag.

## Exceptions
Temporary freshness degradation requires documented impact, mitigation, and owner.

## Verification
Inspect timestamp lineage, freshness dashboards, alerts, stale-serving tests, and SLO definitions.