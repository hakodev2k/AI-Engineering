# Network Observability

## Purpose
Build actionable visibility into network health so operators can distinguish packet loss, latency, routing, DNS, load-balancer, and application failures quickly.

## When to use
Use when designing monitoring, improving incident response, or diagnosing opaque network behavior.

## Inputs
Flow logs, interface counters, routing telemetry, DNS metrics, load-balancer metrics, synthetic probes, traces, and SLOs.

## Context to inspect
Inspect telemetry coverage across edge, transit, service, and dependency paths; confirm timestamps, dimensions, retention, and ownership.

## Core knowledge
Network observability must correlate control-plane state with data-plane symptoms. Aggregate availability alone is insufficient; cardinality and topology context determine diagnostic value.

## Procedure
1. Map critical paths and failure hypotheses.
2. Define golden signals for each network layer.
3. Instrument flow, packet-loss, latency, saturation, and error metrics.
4. Add DNS and routing state telemetry.
5. Deploy synthetic probes from representative locations.
6. Correlate network telemetry with application traces.
7. Define alerts tied to user impact and SLOs.
8. Validate dashboards during controlled failures.
9. Document diagnostic workflows.

## Decision points
Use packet capture for deep diagnosis, not primary monitoring. Prefer active probes when passive telemetry cannot prove end-to-end reachability.

## Common failure patterns
Monitoring only device uptime, missing directional loss, high-cardinality explosions, unsynchronized clocks, and alerts with no topology context.

## Verification
Inject or observe known failures and confirm telemetry identifies affected path, layer, and scope.

## Expected output
A validated observability model, dashboards, alerts, and investigation workflow.

## Stop conditions
Escalate when required telemetry is unavailable due to provider, privacy, or production-access constraints.