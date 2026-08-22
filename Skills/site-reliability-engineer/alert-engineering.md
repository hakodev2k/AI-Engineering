# Alert Engineering

## Purpose
Create alerting that detects meaningful reliability threats early while minimizing noise, duplicate pages, and unactionable interruptions.

## When to use
Use when introducing monitoring, tuning noisy alerts, implementing SLO-based paging, or after incidents were missed or detected too late.

## Inputs
SLIs/SLOs, telemetry, incident history, service dependencies, responder actions, and business criticality.

## Context to inspect
Inspect existing alert rules, notification routes, historical firing frequency, false positives, missed incidents, dashboards, runbooks, and escalation policies.

## Core knowledge
A page should indicate urgent user impact or imminent exhaustion of reliability tolerance and require human action. Symptoms generally produce better pages than low-level causes. Multi-window burn-rate alerts detect fast and slow SLO consumption more reliably than static thresholds.

## Procedure
1. Identify conditions that require immediate human intervention.
2. Tie paging conditions to user-visible symptoms or SLO burn where possible.
3. Analyze historical telemetry to choose thresholds.
4. Add duration, aggregation, and deduplication deliberately.
5. Route alerts to the owning responder group.
6. Attach concise context, dashboards, and runbook links.
7. Test firing and recovery paths.
8. Measure false-positive and non-actionable rates.
9. Remove obsolete or redundant alerts.
10. Review alerts after every relevant incident.

## Decision points
Page for urgent actionable conditions; create tickets for non-urgent degradation; use dashboards for informational signals. Prefer dynamic or SLO-derived thresholds when static limits vary with workload.

## Common failure patterns
Alerting on every error, CPU-only paging, thresholds copied across services, missing ownership, alerts that require manual correlation before action, and leaving alerts after systems change.

## Verification
Replay known incidents against rules where possible, exercise notification routing, confirm responders can identify the intended action, and measure alert quality over time.

## Expected output
A small, actionable alert set with ownership, severity, routing, context, and validated thresholds.

## Stop conditions
Escalate when telemetry cannot distinguish user impact, ownership is undefined, or an alert would require unsafe automatic or manual actions.