# Observability and SLI Rules

## Purpose
Make resilience decisions from measurable service behavior and operational evidence.

## Scope
Applies to logs, metrics, traces, synthetic checks, service-level indicators, dashboards, and alerting used for resilience.

## MUST
- Critical services MUST define SLIs that represent user-relevant availability, latency, correctness, or durability as applicable.
- Telemetry MUST distinguish dependency failure, overload, timeout, rejection, and internal error when operational response differs.
- Resilience mechanisms such as retries, circuit breakers, failovers, shedding, and degraded modes MUST expose activation and outcome signals.
- Telemetry required for incident diagnosis MUST remain available during partial failure to a practical extent.
- Production conclusions MUST cite observable evidence rather than intuition alone.

## MUST NOT
- MUST NOT use infrastructure uptime as the sole availability measure for a user-facing service.
- MUST NOT alert on every low-level symptom when it creates noise without actionable response.
- MUST NOT log secrets or sensitive payloads to improve diagnosis.

## SHOULD
- Dashboards SHOULD connect user impact to dependency and resource signals.
- High-cardinality telemetry SHOULD be controlled to avoid destabilizing the observability system itself.

## Exceptions
Missing telemetry requires a documented diagnostic limitation and remediation priority proportional to risk.

## Verification
Review SLI definitions, dashboards, alert history, trace coverage, incident timelines, and resilience test telemetry. Confirm signals reveal both activation and effectiveness of resilience controls.