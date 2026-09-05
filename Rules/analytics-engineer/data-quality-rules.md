# Data Quality Rules

## Purpose
Prevent invalid, incomplete, stale, or semantically incorrect data from being treated as trusted analytical output.

## Scope
Applies to source validation, transformation outputs, marts, metrics, and published datasets.

## MUST
- Critical datasets MUST define measurable expectations for completeness, uniqueness, validity, consistency, and freshness as relevant.
- Quality checks MUST fail or alert according to documented severity and business impact.
- Known bad data MUST be quarantined, annotated, or blocked from trusted outputs when it can materially mislead consumers.
- Quality thresholds MUST be based on business tolerance or observed distribution evidence, not arbitrary convenience.
- Recurring failures MUST have owners and corrective actions.

## MUST NOT
- MUST NOT convert failed quality checks into warnings solely to keep pipelines green.
- MUST NOT silently replace invalid values with defaults that change analytical meaning.
- MUST NOT label a dataset trusted when critical expectations are untested.

## SHOULD
- Add anomaly detection where fixed assertions cannot adequately protect important measures.
- Track quality trends over time for high-value datasets.

## Exceptions
Exceptions require documented impact, duration, consumer communication, and approval from the accountable owner.

## Verification
Review test results, anomaly alerts, quality dashboards, incident history, and exception records.