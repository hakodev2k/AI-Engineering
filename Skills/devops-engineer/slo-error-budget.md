# SLO and Error Budget Engineering

## Purpose
Translate reliability expectations into measurable operational targets and release decisions.

## When to use
Use for production services requiring explicit reliability, latency, or availability objectives.

## Inputs
User journeys, business impact, telemetry, historical reliability, support expectations.

## Context to inspect
Current incidents, availability metrics, latency distributions, maintenance windows, alert thresholds, release frequency.

## Core knowledge
SLIs measure user-relevant behavior; SLOs are internal targets; error budgets quantify allowable unreliability. Targets should be meaningful, measurable, and stricter only when business value justifies cost.

## Procedure
1. Identify critical user-visible outcomes.
2. Define measurable SLIs.
3. Select target and rolling window.
4. Define exclusions explicitly.
5. Calculate budget consumption.
6. Create burn-rate alerts.
7. Link budget state to release/risk policy.
8. Review after incidents and major architecture changes.
9. Avoid vanity 100% targets.
10. Publish ownership and response expectations.

## Decision points
Use multiple windows for fast/slow burn; choose availability or latency SLI based on user impact; tighten SLO only with evidence.

## Common failure patterns
Infrastructure-only metrics, undocumented exclusions, impossible targets, no policy tied to budget, alerting on single samples.

## Verification
SLI queries reproduce expected results, burn alerts are tested, and teams can explain current budget state.

## Expected output
Documented SLI/SLO definitions, dashboards, burn alerts, and error-budget policy.

## Stop conditions
Stop when required telemetry is too unreliable to support the proposed SLO.