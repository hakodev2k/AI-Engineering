# SLO and Error Budget Engineering

## Purpose
Define measurable reliability targets that connect user experience to engineering priorities and provide a disciplined basis for balancing reliability work against feature delivery.

## When to use
Use when establishing service reliability objectives, reviewing recurring incidents, deciding whether release velocity is sustainable, or replacing vague uptime goals with measurable outcomes.

## Inputs
User journeys, service architecture, historical telemetry, business criticality, dependency behavior, incident history, and stakeholder expectations.

## Context to inspect
Inspect existing SLIs/SLOs, monitoring coverage, request paths, dependency boundaries, maintenance windows, traffic patterns, and contractual commitments. Separate internal SLOs from external SLAs.

## Core knowledge
An SLI measures service behavior; an SLO defines the desired target; an error budget quantifies tolerated unreliability. Good SLIs approximate user-visible success rather than infrastructure health. Targets should be strict enough to protect users but not arbitrarily demand perfection.

## Procedure
1. Identify critical user journeys and service boundaries.
2. Select measurable availability, latency, correctness, freshness, or durability indicators.
3. Define valid events and good events precisely.
4. Validate telemetry quality and sampling behavior.
5. Analyze historical performance before choosing targets.
6. Define SLO windows and targets with stakeholders.
7. Calculate error-budget consumption and burn rates.
8. Establish actions for normal, elevated, and exhausted budgets.
9. Connect alerts to meaningful burn-rate conditions.
10. Review targets periodically as architecture and user expectations change.

## Decision points
Use request-based SLIs for transactional services and time-based indicators only when they reflect actual user impact. Prefer multi-window burn-rate alerts over static threshold alarms. Increase reliability investment when budget consumption demonstrates material user risk; do not tighten targets merely because current performance happens to exceed them.

## Common failure patterns
Using CPU as an SLI, setting 100% targets, measuring only averages, confusing SLA with SLO, excluding inconvenient failures, alerting on every budget fluctuation, and defining objectives without operational consequences.

## Verification
Confirm SLI queries reproduce known incidents, targets are supported by historical evidence, burn calculations are correct, alerts exercise successfully, and stakeholders understand the policy triggered by budget exhaustion.

## Expected output
Documented SLIs, SLO targets, measurement queries, error-budget policy, burn-rate alerts, and ownership.

## Stop conditions
Escalate when telemetry cannot measure the intended user outcome, contractual obligations conflict with proposed objectives, or business owners cannot agree on service criticality.