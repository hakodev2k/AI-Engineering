# Telemetry Crash and Live Diagnostics

## Purpose
Make production game failures diagnosable through privacy-conscious crash reporting, structured telemetry, performance signals, and version-aware diagnostics.

## When to use
Use for live games, beta programs, crash investigations, device-specific defects, performance regressions, or release health monitoring.

## Inputs
Crash SDK/backend, privacy requirements, game versions, device/platform metadata, performance budgets, incident history, and telemetry infrastructure.

## Context to inspect
Inspect crash symbolication, logging, session identifiers, breadcrumbs, build/content versions, error aggregation, performance metrics, and consent/data-retention policies.

## Core knowledge
Production observability must answer which version, platform, state, and sequence preceded failure without collecting unnecessary personal data. Crash signatures need symbols. High-cardinality telemetry and verbose logs can create cost and privacy problems.

## Procedure
1. Define production questions and minimum required signals.
2. Attach build, content, platform, and configuration versions to diagnostics.
3. Enable crash dumps/reports and preserve matching symbols.
4. Add bounded breadcrumbs around critical state transitions.
5. Track frame-time, memory, load, network, and error health where relevant.
6. Aggregate repeated failures by stable signatures.
7. Sample high-volume telemetry deliberately.
8. Redact sensitive data and define retention.
9. Validate diagnostics using controlled crashes/errors.
10. Tie release decisions to explicit health thresholds.

## Decision points
Prefer metrics for trends, structured events for discrete behavior, logs for targeted diagnostics, and traces only where distributed/backend workflows justify them. Sample before cost becomes unbounded.

## Common failure patterns
Unsymbolicated crashes, logs without version context, collecting player text/tokens unnecessarily, unlimited cardinality, diagnostics disabled in release builds, and dashboards without action thresholds.

## Verification
Trigger controlled failures, confirm symbolication and version tags, validate privacy filters, inspect ingestion cost, and verify alerts/dashboards detect regressions.

## Expected output
Actionable production diagnostics with controlled cost and data exposure.

## Stop conditions
Stop when telemetry collection lacks required privacy/legal approval or diagnostic data cannot be stored securely.