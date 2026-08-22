# Observability and Monitoring Rules

## Purpose
Make network health, degradation, and causality observable before and during incidents.

## Scope
Metrics, logs, flow data, telemetry, synthetic probes, alerting, and time synchronization.

## MUST
- Monitor critical paths and foundational services from meaningful vantage points.
- Centralize device and security logs with reliable timestamps.
- Alert on actionable symptoms and capacity/failure indicators with ownership and runbooks.
- Preserve enough telemetry to investigate intermittent and historical failures.

## MUST NOT
- Treat ping success as sufficient evidence of application-path health.
- Suppress noisy alerts without addressing threshold, signal, or ownership quality.

## SHOULD
- Correlate topology, configuration changes, flow data, and service telemetry.

## Exceptions
Telemetry gaps require documented blind spot, risk, and remediation owner.

## Verification
Review dashboards, alert history, log ingestion, time sync, flow coverage, synthetic checks, and incident evidence.