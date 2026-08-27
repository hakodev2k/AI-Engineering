# Network Observability and Telemetry

## Purpose
Build actionable visibility into network health, paths, traffic, configuration, and user-impacting degradation.

## When to use
Use for monitoring design, incident blind spots, telemetry modernization, capacity planning, or noisy alert reduction.

## Inputs
Topology, device inventory, SLOs, SNMP/streaming telemetry, syslog, flow records, synthetic probes, cloud flow logs, and incident history.

## Context to inspect
Metric coverage, polling intervals, label cardinality, clock synchronization, retention, alert routing, topology correlation, configuration changes, and data gaps.

## Core knowledge
Monitor service outcomes and causal signals. Counters need rates/deltas and reset awareness. High-cardinality flow data and streaming telemetry require deliberate retention and aggregation. Alerts should be actionable and tied to impact or imminent risk.

## Procedure
1. Define critical network services and user journeys.
2. Map dependencies and failure domains.
3. Collect interface state/utilization/errors, routing/session health, device resources, environmental state, and key service metrics.
4. Add flow telemetry for traffic composition and path questions.
5. Add synthetic tests for DNS, reachability, latency, loss, and application paths.
6. Ingest configuration-change and authentication logs.
7. Normalize device/site/interface identity.
8. Build dashboards from service to component drill-down.
9. Define alerts using duration, severity, redundancy, and business impact.
10. Test alert delivery and runbook links.
11. Review telemetry gaps after incidents.

## Decision points
Use streaming telemetry for high-frequency/state-rich needs; SNMP remains suitable for broad mature coverage. Retain raw flows only as long as operational/security value justifies cost and privacy exposure.

## Common failure patterns
Alerting every interface flap, no topology context, missing clock sync, dashboards without baselines, monitoring only devices rather than services, and flow collection without capacity planning.

## Verification
Inject or observe known failure states and confirm detection, context, alert routing, dashboard visibility, and recovery closure.

## Expected output
Telemetry architecture, dashboards, actionable alerts, retention/ownership rules, and validated runbooks.

## Stop conditions
Escalate when telemetry collection violates privacy/security policy, credentials are unavailable, or monitoring load risks device/control-plane stability.