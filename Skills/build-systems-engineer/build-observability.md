# Build Observability

## Purpose
Instrument builds so engineers can explain latency, failures, cache behavior, resource use, and regressions from evidence.

## When to use
Use when build performance or reliability is managed at team/repository scale rather than through ad hoc logs.

## Inputs
Build event streams, action metadata, timings, cache events, worker metrics, CI metadata, and privacy/security constraints.

## Context to inspect
Inspect available build event protocols, trace formats, target/action identifiers, user/revision metadata, retention, cardinality, and existing dashboards.

## Core knowledge
Useful build telemetry separates graph analysis, queueing, execution, cache transfer, and critical-path time. High-cardinality labels can make observability expensive. Source paths and command lines may contain sensitive information.

## Procedure
1. Define service-level build questions before collecting metrics.
2. Instrument build phases and action lifecycle events.
3. Record cache hit/miss and transfer latency.
4. Capture critical-path and parallelism data.
5. Correlate CI builds with revision, platform, configuration, and toolchain identity.
6. Add failure taxonomy rather than relying only on free-text logs.
7. Redact secrets and minimize sensitive source metadata.
8. Build dashboards for clean, incremental, no-op, and CI scenarios.
9. Alert on meaningful sustained regressions, not ordinary variance.
10. Retain traces long enough for regression comparison while controlling cost.

## Decision points
Use sampled detailed traces for high-volume fleets and aggregate metrics for long-term trends. Keep raw command lines only when access controls and redaction are adequate.

## Common failure patterns
Measuring averages only, mixing clean/incremental builds, unbounded label cardinality, logging secrets, and collecting metrics with no decision they support.

## Verification
Confirm events reconstruct representative builds; compare telemetry with local timing; validate redaction; induce known cache/failure cases and confirm classification.

## Expected output
A build telemetry schema, dashboards, regression indicators, and privacy-aware retention policy.

## Stop conditions
Stop if telemetry would expose credentials/source data beyond approved boundaries or required event identifiers cannot be made stable enough for analysis.