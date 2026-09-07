# Deliverability Alerting and Anomaly Detection

## Purpose
Detect meaningful deliverability degradation early while avoiding noisy alerts caused by low volume, seasonality, provider mix shifts, or delayed event ingestion.

## When to use
Use when designing alerts, after missed incidents, or when existing threshold alerts generate excessive false positives.

## Inputs
Historical delivery metrics, provider segmentation, message classes, volumes, event lag, known campaign calendars, SLOs, and incident history.

## Preconditions
Telemetry quality and terminal-state definitions must be known.

## Context to inspect
Inspect acceptance, 4xx deferrals, hard bounces, complaints, authentication failures, queue latency, provider event lag, blocklists, reputation signals, and denominator volume.

## Core knowledge
Ratios need minimum-volume guards. Provider-local anomalies can disappear in global aggregates. Baseline-relative detection is often better for recurring traffic, but hard safety thresholds remain appropriate for complaints, authentication failures, and queue saturation.

## Procedure
1. Identify user-impacting symptoms and their earliest reliable signals.
2. Segment alerts by traffic class and major mailbox provider.
3. Establish normal ranges by hour/day and volume band.
4. Combine minimum sample sizes with absolute and relative thresholds.
5. Add dedicated alerts for event-pipeline failure so telemetry outages do not masquerade as delivery health.
6. Correlate related signals into one incident where possible.
7. Define severity, ownership, and runbook links.
8. Backtest rules against historical incidents and normal campaigns.
9. Tune false-positive and missed-incident rates deliberately.
10. Review alert usefulness after each material event.

## Decision points
Use static thresholds for hard operational boundaries; use baselines for variable provider behavior. Page humans only for actionable, time-sensitive degradation; route lower-risk trends to review queues.

## Common failure patterns
Alerting on tiny denominators, one global bounce threshold, ignoring telemetry lag, paging on expected campaign spikes, and thresholds with no prescribed action.

## Verification
Replay historical data, inject synthetic anomalies, verify routing and deduplication, and confirm alerts fire before user-impact SLO breaches where feasible.

## Expected output
A tiered, provider-aware alert set with tested thresholds and runbooks.

## Stop conditions
Stop automated paging if source telemetry is demonstrably corrupt; first alert on and repair observability.