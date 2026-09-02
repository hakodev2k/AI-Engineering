# Capacity Observability

## Purpose
Ensure capacity decisions rely on complete, trustworthy, and actionable telemetry.

## Scope
Applies to metrics, logs, traces, dashboards, alerts, and derived capacity indicators.

## MUST
- Critical capacity resources MUST expose demand, utilization, saturation, errors, and limit metrics where technically available.
- Dashboards MUST distinguish current load from provisioned or usable capacity.
- Capacity alerts MUST provide enough lead time for the expected remediation mechanism.
- Missing or unreliable telemetry MUST be treated as a planning risk and tracked to resolution.

## MUST NOT
- MUST NOT claim sufficient capacity when the relevant limiting resource is unmeasured.
- MUST NOT rely on averages that hide peak saturation or imbalance across instances, partitions, or zones.
- MUST NOT suppress capacity alerts without documented replacement coverage.

## SHOULD
- Use percentiles, distributions, and per-partition views for variable or uneven workloads.
- Retain enough history to support seasonality and growth analysis.

## Exceptions
Exceptions require alternate evidence, documented blind spots, and an owner-approved remediation date.

## Verification
Inspect telemetry coverage, dashboard definitions, alert thresholds, retention windows, and known monitoring gaps.
