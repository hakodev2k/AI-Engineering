# Cloud Network Observability

## Purpose
Create evidence-driven visibility into cloud network reachability, performance, security events, and capacity.

## When to use
Use when establishing monitoring, diagnosing intermittent connectivity, preparing SLOs, or improving incident response.

## Inputs
Topology, critical flows, SLOs, available flow logs, firewall/load-balancer logs, metrics, traces, packet capture capabilities, and cost limits.

## Preconditions
Define the questions telemetry must answer before enabling high-volume logs indiscriminately.

## Context to inspect
VPC/VNet flow logs, firewall logs, LB metrics, NAT metrics, DNS logs, VPN/circuit telemetry, route state, synthetic probes, application traces, and retention/query tooling.

## Core knowledge
Control-plane configuration shows intended state; data-plane telemetry shows observed behavior. Flow logs are sampled/aggregated differently by provider and may not prove packet-level causality. Correlate network evidence with application and infrastructure signals.

## Procedure
1. Identify critical user and service paths.
2. Define golden signals: reachability, latency, loss, throughput, saturation, errors.
3. Enable telemetry at useful enforcement and transit points.
4. Normalize identifiers, timestamps, and network metadata.
5. Build path-oriented dashboards and alerts.
6. Add synthetic probes for critical flows.
7. Define packet-capture escalation procedures.
8. Control telemetry cost and sensitive-data exposure.
9. Test observability by injecting known failures.
10. Document evidence collection for incidents.

## Decision points
Use flow logs for broad visibility, synthetic probes for end-to-end assurance, and packet capture for deep diagnosis. Retain high-cardinality raw data only where investigative value justifies cost.

## Common failure patterns
Collecting logs without queries, alerting on noisy infrastructure metrics, missing DNS/NAT telemetry, unsynchronized timestamps, and assuming absence of flow records means absence of traffic.

## Verification
Demonstrate that known route, security, DNS, capacity, and packet-loss failures can be detected and localized with available telemetry.

## Expected output
A network observability model, dashboards, alerts, queries, retention policy, and incident evidence workflow.

## Stop conditions
Stop if telemetry would expose prohibited data, costs are unbounded, or provider logging semantics are not understood well enough to support conclusions.