# Observability and SLO Rules

## Purpose
Make stream health, freshness, correctness risk, and capacity visible before users experience failure.

## Scope
Applies to metrics, logs, traces, dashboards, alerts, service-level indicators, and objectives.

## MUST
- Critical pipelines MUST define measurable availability and freshness/latency objectives appropriate to business impact.
- Observability MUST cover producer errors, broker health, consumer lag, processing failures, throughput, saturation, and dead-letter volume where applicable.
- Lag MUST be interpreted with ingress rate and time-to-catch-up, not as an isolated count.
- Alerts MUST identify an actionable owner and avoid dependence on payload logging.
- Cross-service correlation identifiers MUST be propagated when needed for end-to-end diagnosis and permitted by privacy rules.

## MUST NOT
- MUST NOT treat zero consumer lag as proof of correctness.
- MUST NOT log full sensitive event payloads as a default diagnostic strategy.
- MUST NOT create paging alerts for non-actionable transient noise.
- MUST NOT claim SLO compliance without measured indicators.

## SHOULD
- Dashboards SHOULD show rates, errors, duration/freshness, saturation, and backlog together.
- SLOs SHOULD distinguish platform availability from business-event processing success.

## Exceptions
Reduced telemetry requires documented cost/privacy reason, alternative evidence, and operational risk acceptance.

## Verification
Review dashboards and alert routes, simulate failures, validate metric cardinality, inspect traces/logs, and compare SLO calculations with raw telemetry.