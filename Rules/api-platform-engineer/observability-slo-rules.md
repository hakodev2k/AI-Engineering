# Observability and SLOs

## Purpose
Make API platform health and consumer impact measurable.

## Scope
Metrics, logs, traces, SLIs, SLOs, dashboards, and alerts.

## MUST
- Critical APIs MUST expose latency, traffic, error, and saturation signals.
- SLOs MUST measure consumer-visible outcomes rather than infrastructure availability alone.
- Traces MUST preserve correlation across gateway and service boundaries where feasible.
- Alerts MUST map to actionable degradation or exhausted error budget.

## MUST NOT
- MUST NOT log credentials, tokens, secrets, or unnecessary sensitive payloads.
- MUST NOT declare reliability from a single average metric.

## SHOULD
- Telemetry SHOULD distinguish tenant, version, route, and dependency dimensions without unsafe cardinality.

## Exceptions
Telemetry omissions require documented observability risk and alternate evidence.

## Verification
Inspect dashboards, alert tests, trace continuity, log redaction, and SLO calculations.