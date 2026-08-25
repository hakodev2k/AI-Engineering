# Edge Observability

## Purpose
Build telemetry that makes distributed edge fleets diagnosable without overwhelming constrained links or exposing sensitive data.

## When to use
Use when defining logs, metrics, traces, health, fleet dashboards, or remote troubleshooting signals.

## Inputs
Fleet topology, critical workflows, bandwidth budgets, retention, privacy constraints, incident history.

## Context to inspect
Inspect existing logs, metrics, health endpoints, upload intervals, cardinality, clock synchronization, and cloud dashboards.

## Core knowledge
Edge observability requires local buffering, bounded telemetry, fleet-level aggregation, version and site dimensions, clock-quality awareness, sampling, and privacy-conscious collection.

## Procedure
1. Define service and fleet health questions before choosing telemetry.
2. Instrument critical paths with low-cardinality metrics.
3. Emit structured logs with device, software, and correlation identifiers.
4. Track local queue depth, disk, resource pressure, connectivity, and sync lag.
5. Buffer telemetry during outages with explicit bounds.
6. Prioritize diagnostic signals over verbose logs during constrained links.
7. Normalize clock and record uncertainty when exact time is unavailable.
8. Build fleet views by version, hardware class, site, and rollout ring.
9. Define alerts on actionable symptoms and SLO risks.
10. Validate telemetry during real failure scenarios.

## Decision points
Use local aggregation when raw telemetry is too expensive to transmit. Increase detail temporarily for targeted diagnostics rather than permanently increasing fleet verbosity.

## Common failure patterns
High-cardinality labels, log-filled disks, missing software-version context, telemetry requiring cloud connectivity, alerts on individual noisy devices.

## Verification
Simulate offline operation, resource exhaustion, rollout failures, and fleet-wide incidents; confirm useful telemetry survives and remains bounded.

## Expected output
A fleet observability design with bounded collection, upload, dashboards, and actionable alerting.

## Stop conditions
Stop when required telemetry would violate privacy, bandwidth, or storage constraints without an approved collection policy.