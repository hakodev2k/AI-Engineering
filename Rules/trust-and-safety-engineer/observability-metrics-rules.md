# Observability and Metrics Rules

## Purpose
Ensure trust-and-safety systems expose enough operational evidence to detect abuse changes, enforcement regressions, blind spots, and user harm.

## Scope
Applies to metrics, logs, dashboards, alerts, traces, sampling, and operational health indicators for safety controls.

## MUST
- Safety-critical systems MUST expose metrics for input volume, detection rate, enforcement rate, review volume, latency, errors, and control availability where applicable.
- Metrics MUST separate system health from policy outcomes so operational failures are not mistaken for reduced abuse.
- High-impact enforcement paths MUST track false-positive indicators, reversals, complaints, and unexplained distribution shifts.
- Dashboards MUST define metric semantics, denominators, aggregation windows, and known sampling limitations.
- Alerts MUST identify actionable conditions and avoid relying solely on raw volume when seasonality or product growth can explain changes.
- Logging MUST preserve diagnostic context without recording unnecessary secrets or sensitive user data.

## MUST NOT
- MUST NOT claim abuse declined because enforcement volume declined without checking exposure, detector health, traffic, and attacker adaptation.
- MUST NOT use vanity metrics that cannot distinguish safer outcomes from reduced detection.
- MUST NOT log private content, authentication data, or sensitive identifiers beyond the minimum necessary diagnostic purpose.
- MUST NOT suppress noisy alerts without addressing the underlying signal quality or documenting the replacement control.

## SHOULD
- Metrics SHOULD support cohort, surface, geography, and enforcement-type analysis where privacy permits.
- Leading indicators SHOULD complement lagging harm outcomes for fast-moving threats.
- Alert thresholds SHOULD be validated against historical incidents and normal variation.

## Exceptions
Emergency incident instrumentation MAY temporarily increase diagnostic detail when authorized and time-bounded. Sensitive collection MUST be removed or reduced after stabilization.

## Verification
Inspect metric definitions, dashboards, alert history, logging schemas, redaction, sampled incidents, and detector-health monitors. Confirm changes in safety outcomes can be distinguished from telemetry failures or product-volume changes.