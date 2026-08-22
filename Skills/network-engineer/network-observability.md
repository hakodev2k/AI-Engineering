# Network Observability

## Purpose
Create actionable visibility into network health, traffic, paths, capacity, and failures so operators can distinguish symptoms from causes quickly.

## When to use
Use when building monitoring, reducing MTTR, investigating intermittent faults, validating migrations, or defining SLO-supporting telemetry.

## Inputs
Topology, device metrics, interface counters, flow data, logs, routing telemetry, synthetic tests, application symptoms, and service objectives.

## Context to inspect
Inspect SNMP/streaming telemetry, syslog, NetFlow/IPFIX, packet loss, latency, errors/discards, BGP state, DNS, firewall logs, cloud flow logs, and alert history.

## Core knowledge
No single signal proves network health. Correlate control plane, forwarding plane, traffic demand, and end-to-end experience. Alert on user-impacting conditions and actionable precursors, not raw noise.

## Procedure
1. Identify critical network services and paths.
2. Define useful health and saturation signals.
3. Collect device, flow, routing, and synthetic telemetry.
4. Normalize timestamps, labels, and topology metadata.
5. Build dashboards around service/path questions.
6. Define alerts with severity and ownership.
7. Correlate network and application signals.
8. Retain enough history for baseline and incident analysis.
9. Test alerting by controlled failure where safe.

## Decision points
Use flow telemetry for traffic attribution, packet capture for detailed diagnosis, and synthetics for user-path validation. High-cardinality telemetry should be scoped to operational value and cost.

## Common failure patterns
Monitoring only device up/down, alert storms, missing interface errors, no topology context, unsynchronized clocks, short retention, and dashboards with no operational decisions attached.

## Verification
Confirm telemetry survives representative failures, alerts reach owners, dashboards identify affected paths, and historical data supports root-cause analysis.

## Expected output
An observability model with metrics, logs, flows, synthetics, dashboards, alerts, retention, and ownership.

## Stop conditions
Escalate when telemetry access is restricted, timestamps cannot be trusted, or monitoring changes could overload production devices.