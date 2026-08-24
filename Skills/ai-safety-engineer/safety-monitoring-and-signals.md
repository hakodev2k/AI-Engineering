# Safety Monitoring and Signals

## Purpose
Detect emerging safety failures in production early enough to contain impact and improve controls.

## When to use
Use when operating AI systems exposed to real users, external content, changing models, or consequential tools.

## Inputs
Risk register, telemetry, user reports, moderation events, tool logs, evaluation metrics, privacy constraints.

## Context to inspect
Data retention, sampling, alerting, dashboards, incident process, false-positive costs, and blind spots.

## Core knowledge
Safety monitoring needs leading and lagging indicators. Telemetry must preserve privacy and avoid logging sensitive model context unnecessarily.

## Procedure
1. Map material hazards to observable signals.
2. Define severity and alert thresholds.
3. Instrument model, retrieval, tool, policy, and user-feedback layers.
4. Minimize sensitive logging and control access.
5. Establish baselines and anomaly detection where useful.
6. Route alerts to accountable responders.
7. Correlate signals across sessions and components.
8. Review false positives, false negatives, and coverage gaps.
9. Feed incidents back into evals and requirements.

## Decision points
Use real-time alerts for rapidly escalating harm; use periodic analysis for slow-moving distribution shifts.

## Common failure patterns
Monitoring only refusal rate; collecting excessive sensitive content; alert floods; no owner; dashboards without response playbooks.

## Verification
Exercise alerts with synthetic scenarios and confirm detection, routing, evidence quality, and response timing.

## Expected output
A privacy-aware safety observability plan with actionable signals and owners.

## Stop conditions
Escalate if severe hazards have no observable signal or monitoring requires unacceptable privacy exposure.