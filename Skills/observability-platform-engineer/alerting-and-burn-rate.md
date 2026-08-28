# Alerting and Burn Rate

## Purpose
Design actionable alerts that detect meaningful reliability risk while controlling noise and operator fatigue.

## When to use
Use when creating paging policy, tuning noisy alerts, or moving from threshold alerts to SLO-based alerting.

## Inputs
SLOs, historical incidents, traffic patterns, escalation policy, notification channels.

## Context to inspect
Inspect current alert rules, firing history, acknowledgement time, false positives, missed incidents, and ownership.

## Core knowledge
Understand symptom vs cause alerts, multi-window burn-rate alerting, hysteresis, grouping, inhibition, deduplication, and escalation.

## Procedure
1. Define the user-impacting condition that warrants action.
2. Prefer symptoms tied to SLO risk over raw resource thresholds.
3. Choose fast and slow burn windows for urgent and sustained degradation.
4. Set routing, grouping, and ownership metadata.
5. Add runbook links and diagnostic context.
6. Test alerts against historical incidents.
7. Shadow or stage new paging rules.
8. Review noisy and non-actionable alerts regularly.

## Decision points
Page only when immediate human action can improve the outcome; ticket or dashboard conditions that tolerate delay.

## Common failure patterns
Static CPU pages, duplicate alerts, missing owners, flapping thresholds, alerting on every dependency error.

## Verification
Replay representative failures, confirm expected firing and recovery, and track precision, noise, and missed-event rates.

## Expected output
An actionable alert policy with tested thresholds, routing, and runbooks.

## Stop conditions
Stop if no owner or corrective action exists for a proposed page.