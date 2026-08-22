# Observability and Analytics

## Purpose
Instrument mobile apps so engineers can understand failures, performance, releases, and user-impacting behavior without violating privacy.

## When to use
New features, incident readiness, release monitoring, funnel/performance analysis.

## Inputs
Critical journeys, telemetry platform, privacy rules, release metadata.

## Context to inspect
Logs, crashes, traces, metrics, analytics events, identifiers, sampling, consent.

## Core knowledge
Telemetry must answer decisions. Mobile events can arrive late, duplicate, or never arrive. Avoid collecting secrets and unnecessary personal data.

## Procedure
1. Define operational questions and success/failure signals.
2. Create stable event/error taxonomy.
3. Include app version, OS, device class, feature context where appropriate.
4. Add correlation IDs for network flows.
5. Sanitize payloads and honor consent/retention rules.
6. Sample high-volume telemetry deliberately.
7. Build release and critical-journey views.
8. Test telemetry under offline/retry conditions.

## Decision points
Prefer aggregate metrics for trends and structured events for diagnosis; collect only data with clear value.

## Common failure patterns
PII in logs, event-name drift, no release dimension, dashboards without actionable thresholds.

## Verification
Trigger known scenarios and confirm sanitized, queryable evidence end-to-end.

## Expected output
Operational telemetry contract and useful release diagnostics.

## Stop conditions
Escalate ambiguous privacy/legal collection requirements.