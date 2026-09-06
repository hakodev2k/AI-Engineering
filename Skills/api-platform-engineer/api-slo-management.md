# API SLO Management

## Purpose
Define and operate measurable API reliability objectives tied to consumer experience.

## When to use
Use for production APIs requiring reliability targets, error budgets, and release-risk decisions.

## Inputs
Consumer expectations, traffic, latency distributions, failure modes, business criticality.

## Context to inspect
Inspect historical availability, dependency reliability, existing alerts, maintenance behavior, and measurement points.

## Core knowledge
SLIs measure behavior; SLOs set objectives; error budgets quantify tolerated unreliability. Measurements should reflect user-visible success and exclude only explicitly justified traffic.

## Procedure
1. Identify critical consumer journeys.
2. Define success semantics and measurement boundary.
3. Select availability and latency SLIs.
4. Establish realistic objectives from business need and historical capability.
5. Define valid exclusions explicitly.
6. Implement rolling-window calculations.
7. Configure multi-window burn-rate alerts.
8. Establish error-budget policy for risky changes.
9. Review breaches and recurring budget consumption.
10. Revisit objectives when architecture or consumer expectations change.

## Decision points
Do not target 100% unless the system can truly support it and cost is justified. Measure at the consumer-facing boundary when possible.

## Common failure patterns
Infrastructure uptime masquerading as API availability, percentile-only alerting, arbitrary targets, excessive exclusions, and SLOs disconnected from release decisions.

## Verification
Reconcile SLI calculations with known incidents and synthetic failures; verify alerts trigger at intended burn rates.

## Expected output
Consumer-relevant SLOs, dashboards, alerts, and error-budget operating rules.

## Stop conditions
Stop if success semantics or measurement boundaries cannot be defined reliably.