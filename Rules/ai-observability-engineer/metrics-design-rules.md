# Metrics Design Rules

## Purpose
Define reliable quantitative signals for AI system health, quality, performance, cost, and usage.

## Scope
Applies to counters, gauges, histograms, derived metrics, labels, aggregation, and metric ownership.

## MUST
- Each production metric MUST have a documented definition, unit, aggregation semantics, owner, and intended decision use.
- Request volume, success/failure, latency, model-call outcomes, token usage, and critical dependency health MUST be measurable for user-facing AI paths.
- Histograms or equivalent distributions MUST be used for latency and size metrics where tail behavior matters.
- Metric labels MUST use bounded dimensions with controlled cardinality.
- Derived percentages and rates MUST define numerator, denominator, and time window explicitly.

## MUST NOT
- User identifiers, prompt text, document IDs with unbounded population, or arbitrary error strings MUST NOT be used as metric labels.
- A dashboard value MUST NOT be presented as a service-level truth if its metric semantics are undocumented or ambiguous.
- Averages MUST NOT be used alone to represent latency-sensitive production behavior.

## SHOULD
- Prefer stable domain-oriented metrics over implementation-detail metrics.
- Track saturation and queue pressure where capacity constraints exist.

## Exceptions
Exceptions require documented operational need, bounded cardinality evidence, cost impact, and reviewer approval.

## Verification
Inspect metric definitions, label sets, cardinality reports, dashboards, alert expressions, and representative raw samples. Validate calculations against controlled test traffic.