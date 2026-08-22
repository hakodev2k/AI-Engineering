# Frontend Observability

## Purpose
Make production React failures, latency, and user-impact diagnosable through useful telemetry.

## When to use
Use when adding monitoring, investigating production defects, or defining release health signals.

## Inputs
Logging/error platform, performance telemetry, release metadata, privacy constraints.

## Preconditions
Define what telemetry is allowed and which data is sensitive.

## Context to inspect
Error reporting, source maps, breadcrumbs, performance spans, release/version tags, user/session identifiers.

## Core knowledge
Useful telemetry correlates errors with release, route, operation, and upstream requests while minimizing personal or secret data.

## Procedure
1. Define critical user journeys and signals.
2. Capture uncaught/runtime errors with release metadata.
3. Upload protected source maps where supported.
4. Add structured breadcrumbs around navigation and important actions.
5. Measure web vitals and selected app interactions.
6. Propagate correlation IDs when available.
7. Apply sampling and privacy controls.
8. Build dashboards/alerts around user impact, not raw event volume.

## Decision points
Sample high-volume performance data more aggressively than rare critical errors.

## Common failure patterns
Logging sensitive payloads, missing source maps, alerting on noise, telemetry without release context.

## Verification
Trigger known errors in a safe environment and confirm stack traces, correlation, dashboards, and privacy filters.

## Expected output
Actionable production telemetry.

## Stop conditions
Stop if telemetry collection conflicts with privacy/compliance requirements.