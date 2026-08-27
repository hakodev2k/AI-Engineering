# Alert Engineering

## Purpose
Design actionable data alerts that detect material reliability failures without overwhelming responders with noise.

## When to use
Use when introducing alerts, tuning noisy monitors, defining severities, or connecting data observability to incident management.

## Inputs
SLOs, monitor history, incident history, ownership, business criticality, lineage, alert delivery systems.

## Preconditions
Each alertable condition must have an identifiable owner or escalation route.

## Context to inspect
Review thresholds, false positives, duplicate alerts, notification channels, on-call coverage, maintenance windows, runbooks, and downstream impact.

## Core knowledge
Alert quality is measured by actionability, precision, timeliness, and coverage rather than alert count. Senior engineers combine symptom and cause signals, deduplicate correlated failures, and align severity to user impact.

## Procedure
1. Start from failure modes and SLO breaches.
2. Define the action a responder should take for each alert.
3. Select the minimum signals needed to detect the condition.
4. Set thresholds using historical behavior and impact tolerance.
5. Add persistence windows to suppress transient noise where appropriate.
6. Enrich alerts with dataset, owner, lineage, run ID, and diagnostic evidence.
7. Group correlated downstream alerts around likely upstream causes.
8. Route severity based on business impact and recovery urgency.
9. Test notification and escalation paths.
10. Measure false positives, misses, and time-to-diagnosis; tune regularly.

## Decision points
Page only for urgent conditions requiring immediate human action. Use tickets or asynchronous notifications for non-urgent degradation. Prefer one root-cause alert over dozens of derivative symptoms when evidence supports correlation.

## Common failure patterns
- Alerting on every failed task
- No ownership
- Thresholds copied across datasets
- Duplicate alerts from dependent models
- Alerts without evidence or runbook context

## Verification
Replay historical incidents and confirm alerts fire at useful times, route correctly, and remain quiet during normal variance.

## Expected output
A severity model, actionable alerts, routing rules, deduplication logic, and alert-quality metrics.

## Stop conditions
Escalate when paging expectations or ownership cannot be agreed for critical data products.