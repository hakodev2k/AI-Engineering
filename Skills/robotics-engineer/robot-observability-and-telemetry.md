# Robot Observability and Telemetry

## Purpose
Design telemetry that exposes robot health, timing, state transitions, safety events, and subsystem degradation without overwhelming compute, storage, or operators.

## When to use
Use when commissioning production robots, improving incident diagnosis, defining fleet health, or when logs are insufficient to explain failures.

## Inputs
Architecture, critical states, failure modes, control rates, storage/network budgets, privacy/security constraints, operator workflows.

## Preconditions
Subsystem ownership and major operational failure modes are understood.

## Context to inspect
Existing logs, metrics, traces, event streams, bag capture, timestamps, clock sync, retention, upload behavior, dashboards, alerting.

## Core knowledge
Useful robot observability connects high-rate physical signals with discrete software events and version/configuration identity. Logging every signal at full rate is neither sustainable nor necessarily useful.

## Procedure
1. Identify operational questions and incident classes telemetry must answer.
2. Define common robot/run/version/configuration identifiers.
3. Standardize severity, event names, timestamps, units, and frames.
4. Select metrics for health, resource use, timing, sensor freshness, actuator faults, localization quality, and mission outcomes.
5. Add structured events for mode/state transitions and safety actions.
6. Define bounded high-rate trace capture around faults.
7. Set sampling, compression, retention, and upload budgets.
8. Protect sensitive data and credentials.
9. Build dashboards and alerts tied to actionable thresholds.
10. Validate observability by diagnosing staged failures using telemetry alone.

## Decision points
Use continuous metrics for trends, structured logs for discrete context, traces/bags for causal reconstruction, and triggered capture for expensive high-rate data.

## Common failure patterns
Unsynchronized clocks, free-form logs, missing software/config versions, no pre-fault buffer, excessive telemetry causing deadline misses, and alerts without operator actions.

## Verification
Stage representative sensor, actuator, timing, localization, network, and resource failures and confirm telemetry identifies onset, scope, and recovery without exceeding budgets.

## Expected output
Telemetry schema, dashboards/alerts, capture/retention policy, and diagnostic validation evidence.

## Stop conditions
Stop adding telemetry when it threatens real-time behavior, exceeds privacy/security constraints, or lacks a defined diagnostic/operational use.