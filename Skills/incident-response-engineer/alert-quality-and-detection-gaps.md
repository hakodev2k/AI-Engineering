# Alert Quality and Detection Gaps

## Purpose
Evaluate whether monitoring detects meaningful incidents early enough and improve signals without creating unsustainable alert noise.

## When to use
Use after missed incidents, late detection, noisy pages, duplicate alerts, or recurring manual discovery.

## Inputs
Alert history, incident timelines, SLOs, metrics, paging data, false-positive rates, dashboards, and responder feedback.

## Context to inspect
Inspect thresholds, evaluation windows, aggregation, routing, suppression, dependency alerts, symptom versus cause signals, and business KPIs.

## Core knowledge
Pages should demand timely human action. Detection should favor user-impact signals and actionable failure modes. More alerts can reduce reliability by consuming responder attention.

## Procedure
1. Identify when customer impact began and when responders were notified.
2. Determine which existing signals changed before or during impact.
3. Classify alerts as actionable, informational, duplicate, or noisy.
4. Identify missing symptom-based signals.
5. Tune thresholds and windows using historical distributions.
6. Add dimensions needed to bound scope without uncontrolled cardinality.
7. Route alerts to accountable owners.
8. Define runbook links and expected first actions.
9. Test alerts with controlled failure or replayed data where possible.
10. Measure page volume and detection improvement after changes.

## Decision points
Page on symptoms when immediate action is required; use dashboards or tickets for nonurgent conditions. Prefer multi-window or burn-rate logic for SLO-related paging when appropriate.

## Common failure patterns
Alerting on every exception, static thresholds without baseline context, paging on causes with no user impact, duplicate pages, and alerts without ownership.

## Verification
Demonstrate that representative failures trigger the intended alert within the target detection time and normal behavior does not create excessive pages.

## Expected output
A detection-gap assessment and validated alert improvements with ownership and expected action.

## Stop conditions
Escalate when required telemetry is unavailable, privacy-sensitive, or too costly to collect safely.