# Alert Design

## Purpose
Create actionable alerts that detect meaningful service degradation while minimizing noise and responder fatigue.

## When to use
Use when introducing production alerts, reviewing noisy paging, or connecting monitoring to SLOs.

## Inputs
SLOs, incident history, telemetry, ownership, escalation policy, and service dependencies.

## Context to inspect
Inspect existing alert rules, page frequency, false positives, missed incidents, thresholds, notification routes, and runbooks.

## Core knowledge
A page should require timely human action. Symptoms are generally better paging signals than speculative causes. Multi-window burn-rate alerts can detect both fast and slow SLO consumption.

## Procedure
1. Define the user-impact condition.
2. Decide whether it requires page, ticket, or dashboard visibility.
3. Select reliable signals and evaluation windows.
4. Set thresholds from SLOs and historical behavior.
5. Add ownership, severity, context, and runbook links.
6. Test missing-data behavior.
7. Simulate known incidents.
8. Review alert performance after deployment.

## Decision points
Page on urgent actionable symptoms; create non-paging notifications for trends or capacity work. Use static thresholds only when the operating range is stable and meaningful.

## Common failure patterns
Alerting on every exception, CPU-only pages, threshold guessing, duplicate alerts, no owner, no runbook, and pages that require no action.

## Verification
Replay or simulate incidents and confirm the alert fires at an appropriate time, routes correctly, and provides enough context for first response.

## Expected output
Low-noise, owned, actionable alert rules with validation evidence.

## Stop conditions
Escalate when no team owns the service or no reliable user-impact signal exists.