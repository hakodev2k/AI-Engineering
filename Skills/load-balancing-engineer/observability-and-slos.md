# Load Balancer Observability and SLOs

## Purpose
Instrument balancing tiers so operators can distinguish client, proxy, network, and backend failures and manage service objectives.

## When to use
Use when building dashboards, defining alerts, troubleshooting incidents, or establishing SLOs.

## Inputs
Service objectives, metrics, logs, traces, topology, error taxonomy, and traffic dimensions.

## Context to inspect
Inspect available proxy metrics, access logs, trace propagation, backend telemetry, cardinality, retention, and alert history.

## Core knowledge
Golden signals include traffic, errors, latency, and saturation, but load balancers also require connection, handshake, backend-health, queue, retry, and distribution metrics. High-cardinality labels can destabilize telemetry systems.

## Procedure
1. Define user-visible SLIs and balancing-tier responsibilities.
2. Instrument request and connection rates.
3. Capture response codes and proxy-specific failure reasons.
4. Measure latency by phase when supported.
5. Track backend health, ejection, queue, retries, and utilization skew.
6. Correlate logs with request/trace identifiers.
7. Build dashboards by region, listener, pool, and backend class.
8. Alert on symptoms tied to SLO burn and saturation.
9. Test telemetry during injected failures.
10. Review noisy or unused signals.

## Decision points
Alert on user impact and exhaustion trends rather than every backend transition. Use sampling for high-volume logs while retaining rare errors.

## Common failure patterns
Only total RPS dashboard; no backend dimension; alerting on single probe failures; unbounded labels; proxy errors indistinguishable from application errors.

## Verification
During failure tests, operators must be able to identify affected layer, scope, backend pool, and SLO impact from telemetry alone.

## Expected output
SLIs, dashboards, alerts, log schema, and trace integration for the balancing tier.

## Stop conditions
Escalate when telemetry cannot distinguish proxy from backend failures or required identifiers violate privacy policy.