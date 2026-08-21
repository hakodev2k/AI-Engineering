# Monitoring and Alert Tuning

## Purpose
Create actionable alerts that detect real service risk without causing alert fatigue.

## When to use
Use when adding monitors, reducing noisy alerts, improving incident detection, or aligning alerts to SLOs.

## Inputs
Telemetry, incident history, SLOs, on-call ownership, dependency behavior.

## Context to inspect
Current pages/tickets, false positives, missed incidents, thresholds, evaluation windows, routing, maintenance suppression.

## Core knowledge
Pages should represent urgent actionable user impact or imminent risk. Prefer symptom and burn-rate alerts; route lower-urgency conditions to tickets/dashboards.

## Procedure
1. Review incidents and alert usefulness.
2. Classify each alert by action and urgency.
3. Remove duplicates and non-actionable pages.
4. Tie thresholds to user/service behavior.
5. Use appropriate duration/hysteresis.
6. Add runbook and owner.
7. Suppress expected maintenance safely.
8. Test alert routing.
9. Measure false positive and missed-detection rates.
10. Tune continuously from incidents.

## Decision points
Page for immediate action, ticket for planned work, dashboard for context; use multi-window burn alerts for SLO-driven services.

## Common failure patterns
CPU >80% pages, no owner, static thresholds across workloads, duplicate alerts, alerts that auto-resolve before action.

## Verification
Synthetic or controlled test reaches correct channel with useful context and runbook; noise rate decreases without missed incidents.

## Expected output
Actionable monitoring set with ownership and evidence-based thresholds.

## Stop conditions
Stop removing alerts if equivalent detection coverage is not demonstrated.