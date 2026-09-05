# Observability Rules

## Purpose
Provide sufficient evidence to detect, localize, and explain network reliability failures.

## Scope
Metrics, logs, events, synthetic checks, topology data, dashboards, and alerts.

## MUST
- Critical network components and paths MUST expose health, utilization, error, and availability signals appropriate to their function.
- Alerts MUST map to actionable conditions and clear ownership.
- Monitoring MUST distinguish control-plane health, forwarding health, and service reachability when relevant.
- Deployment and change events MUST be visible alongside reliability telemetry.
- Telemetry retention MUST support investigation of material incidents.

## MUST NOT
- MUST NOT depend on a single monitoring vantage point for critical reachability conclusions.
- MUST NOT suppress recurring alerts without addressing cause or documenting accepted risk.
- MUST NOT claim root cause when telemetry only establishes correlation.

## SHOULD
- Use service-oriented dashboards in addition to device-oriented dashboards.
- Prefer low-noise alerts tied to user or system impact.

## Exceptions
Telemetry gaps require documented limitation, alternative evidence, risk, and owner.

## Verification
Review dashboards, alert definitions, synthetic checks, telemetry coverage, change annotations, and incident records.