# Guardrail Observability and Telemetry

## Purpose
Observe decisions, failures, latency, and bypasses without sensitive-data leakage.

## When to use
Use for production operation and diagnosis.

## Inputs
Architecture, taxonomy, telemetry, privacy, SLOs, incident needs.

## Context to inspect
Inspect logs, metrics, traces, sampling, retention, correlation, dashboards, alerts.

## Core knowledge
Record decisions/reasons rather than unnecessary payloads; correlate control, model, authorization, output, and effects.

## Procedure
1. Define event schemas.
2. Record versions.
3. Correlate layers.
4. Emit latency/availability.
5. Record category/confidence/action/reason.
6. Redact attributes.
7. Build dashboards.
8. Alert on bypass/outages.
9. Preserve rare events.
10. Test degradation.

## Decision points
Full payload logs only under explicit tightly controlled need.

## Common failure patterns
No versions, raw prompts, missing correlation, context-free alerts, silent timeouts.

## Verification
Reconstruct decisions without unnecessary exposure.

## Expected output
Schemas, dashboards, alerts, runbooks.

## Stop conditions
Escalate unauditable decisions or unsafe telemetry.