# SLO and SLI Engineering

## Purpose
Translate reliability expectations into measurable service-level indicators and objectives that guide engineering decisions.

## When to use
Use for production services whose reliability needs prioritization, alerting, or error-budget governance.

## Inputs
User journeys, business expectations, historical telemetry, dependency behavior, and operational capacity.

## Context to inspect
Inspect availability definitions, latency distributions, correctness signals, traffic segmentation, maintenance behavior, and existing commitments.

## Core knowledge
An SLI is a measured proportion or distribution representing user experience; an SLO is its target over a window. Good SLIs measure outcomes users care about and are feasible to measure consistently.

## Procedure
1. Identify critical user journeys.
2. Define good and total events or equivalent latency/correctness measures.
3. Validate measurement points and exclusions.
4. Analyze historical performance.
5. Propose realistic targets and windows.
6. Define error-budget calculation.
7. Connect SLOs to dashboards and burn-rate alerts.
8. Establish review and target-adjustment governance.

## Decision points
Prefer end-to-end outcome SLIs over infrastructure proxies. Use stricter targets only when user value justifies the operational cost.

## Common failure patterns
100% targets, measuring only uptime, hidden exclusions, SLOs copied from competitors, and objectives without operational consequences.

## Verification
Recalculate SLO results from source telemetry, test failure scenarios, and confirm stakeholders agree the indicator reflects user impact.

## Expected output
Documented SLIs, SLO targets, error budgets, queries, and ownership.

## Stop conditions
Stop when user expectations or trustworthy measurement sources are unavailable.