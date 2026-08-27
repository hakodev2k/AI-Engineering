# Network Telemetry and Streaming

## Purpose
Collect reliable high-value network state for automation decisions, validation, and observability.

## When to use
Use for streaming telemetry, automated postchecks, anomaly detection, capacity signals, and closed-loop workflows.

## Inputs
Telemetry requirements, device capabilities, paths/counters, collection interval, transport, retention, and consumers.

## Context to inspect
SNMP, gNMI, syslog, flow telemetry, controller events, timestamping, collector capacity, and data-loss behavior.

## Core knowledge
Telemetry is a distributed data pipeline. Sampling, counter resets, clock skew, backpressure, cardinality, and gaps can invalidate automation decisions.

## Procedure
1. Define decisions/SLOs telemetry must support.
2. Select authoritative signals and collection methods.
3. Normalize identity, units, timestamps, and counter semantics.
4. Size sampling and retention to operational value.
5. Detect gaps, resets, stale data, and collector lag.
6. Correlate config changes with state transitions.
7. Establish baselines and thresholds.
8. Expose queryable data to validation workflows.
9. Test collector/device failure and reconnect.
10. Document signal confidence and limitations.

## Decision points
Use streaming for timely state, polling for low-frequency stable data, and events for discrete transitions. Do not close the loop on low-confidence telemetry.

## Common failure patterns
High-cardinality overload, treating missing data as healthy, counter-wrap errors, unsynchronized clocks, and sampling too slowly for transient failures.

## Verification
Cross-check telemetry against device state, simulate stream loss, verify timestamp/counter handling, and measure end-to-end lag.

## Expected output
Telemetry contract, normalized pipeline, health checks, and automation-ready signals.

## Stop conditions
Stop automated decisions when data is stale, incomplete, or identity mapping is ambiguous.