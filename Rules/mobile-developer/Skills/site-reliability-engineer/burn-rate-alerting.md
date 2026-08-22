# Burn-Rate Alerting

## Purpose
Design actionable alerts that detect meaningful reliability risk without overwhelming responders with noise.

## When to use
Use when creating or reviewing production alerts for services with defined SLOs, especially when existing alerts are based on static infrastructure thresholds. Do not page for conditions that have no clear user impact or operator action.

## Inputs
SLIs, SLOs, error-budget policy, traffic profile, historical incidents, current alert rules, telemetry resolution, and on-call constraints.

## Preconditions
The relevant SLI must be measurable and the alert path must have an accountable responder.

## Context to inspect
Existing pages, false-positive history, missed incidents, request/error metrics, latency distributions, async backlog metrics, dependency behavior, and notification routing.

## Core knowledge
Burn rate expresses how quickly a service consumes its error budget relative to the allowed rate. Multi-window, multi-burn-rate alerting catches fast catastrophic failures while still detecting slower sustained degradation. Page only when urgency and impact justify interruption; route lower urgency signals to tickets or dashboards.

## Procedure
1. Identify the SLO and error budget to protect.
2. Define fast-burn and slow-burn scenarios that warrant action.
3. Select short and long evaluation windows.
4. Build alerts from SLI failure ratios, not raw host metrics.
5. Require sustained evidence where needed to reduce transient noise.
6. Attach service, impact, dashboard, runbook, and recent-change context.
7. Route pages to the owning on-call team.
8. Replay historical incident data to test sensitivity.
9. Review every noisy or missed alert and tune thresholds or signal design.
10. Retire duplicate alerts that page on the same underlying failure.

## Decision points
Use paging for imminent or active user-impacting budget burn. Use non-paging notification for trends that need work but not immediate intervention. Keep infrastructure alerts only when they predict user impact earlier and reliably.

## Common failure patterns
CPU-threshold paging, single-window alerts, missing runbooks, alert fan-out to multiple teams, repeated pages for one incident, and thresholds chosen without historical validation.

## Verification
Backtest against known incidents, measure false positives and missed events, verify notification routing, and confirm responders can identify the affected SLO and first action from the alert.

## Expected output
A minimal set of SLO-aligned alert rules with documented windows, thresholds, routing, and runbook links.

## Stop conditions
Escalate when telemetry quality makes burn-rate calculation unreliable or when ownership for the affected service is unresolved.