# Observability and Alerting Rules

## Purpose
Make production web-performance degradation visible, attributable, and actionable.

## Scope
Applies to RUM dashboards, synthetic monitors, release markers, alerts, SLO-style thresholds, and performance telemetry.

## MUST
- Alert on metrics and journeys that represent meaningful user harm, not vanity scores alone.
- Define thresholds, evaluation windows, affected population, and ownership for actionable alerts.
- Correlate performance changes with releases, configuration changes, dependency incidents, and infrastructure events where possible.
- Preserve enough historical data to distinguish regression from normal variance.

## MUST NOT
- Create alerts with no response owner or defined action.
- Suppress recurring regressions without documented disposition.
- Use averages alone for latency-sensitive alerts when tail behavior matters.

## SHOULD
- Combine field telemetry with synthetic checks for early detection and diagnosis.
- Prefer low-noise alerts tied to critical user journeys.

## Exceptions
Exceptions require rationale, compensating monitoring, owner approval, and a review date.

## Verification
Inspect alert definitions, dashboards, historical incidents, release annotations, synthetic coverage, and notification tests.