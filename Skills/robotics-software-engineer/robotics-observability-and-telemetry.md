# Robotics Observability and Telemetry

## Purpose
Make robot behavior diagnosable in development and the field through structured logs, metrics, traces, state snapshots, and selectively recorded sensor data.

## When to use
Use when designing production telemetry, investigating intermittent failures, establishing fleet health, or reducing mean time to diagnosis.

## Inputs
- System architecture
- Critical state and failure modes
- Storage/network limits
- Privacy/security constraints
- Incident history

## Preconditions
Telemetry must not interfere materially with real-time behavior or expose sensitive data without controls.

## Context to inspect
Inspect logs, ROS diagnostics, topic rates, health endpoints, traces, rosbag/recording policies, clock synchronization, correlation IDs, dashboards, and alert thresholds.

## Core knowledge
Understand structured logging, high-cardinality risk, metrics design, tracing, sampling, timestamp consistency, flight recorders, bounded storage, health versus readiness, and post-incident evidence.

## Procedure
1. Identify critical questions operators must answer during failures.
2. Define health metrics for sensors, actuators, estimators, planners, compute, network, and safety state.
3. Emit structured logs with stable event identifiers and context.
4. Add timing metrics at subsystem boundaries.
5. Use traces or correlation IDs for end-to-end mission paths.
6. Implement bounded flight-recorder capture for high-volume data.
7. Preserve clock and software-version metadata with recordings.
8. Define alert thresholds from operational impact, not arbitrary resource percentages.
9. Test telemetry during degraded network and storage conditions.
10. Verify observability overhead under peak workloads.
11. Turn recurring field questions into durable telemetry signals.

## Decision points
Record raw sensor streams selectively because they are expensive but invaluable for reconstruction. Prefer metrics for detection, logs for explanation, and traces/recordings for causal reconstruction.

## Common failure patterns
- Logs without timestamps or robot identity
- Unbounded recording filling disks
- Telemetry causing missed deadlines
- Alerts on noisy symptoms rather than mission impact
- Missing software/configuration version in incident data

## Verification
Trigger representative faults and confirm operators can identify affected subsystem, timing, software version, safety state, and preceding events without local debugger access.

## Expected output
A bounded observability design with actionable metrics, structured events, traceability, recording policy, and operational dashboards/alerts.

## Stop conditions
Stop if telemetry collection violates privacy/security requirements, can exhaust critical resources, or cannot be bounded sufficiently for the deployed platform.