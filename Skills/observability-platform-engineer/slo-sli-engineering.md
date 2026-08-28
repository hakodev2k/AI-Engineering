# SLO and SLI Engineering

## Purpose
Define measurable service reliability targets that connect telemetry to user impact and engineering decisions.

## When to use
Use when establishing reliability objectives, replacing vague uptime goals, or aligning alerts with customer impact.

## Inputs
User journeys, service contracts, historical telemetry, business tolerance, dependency behavior.

## Context to inspect
Inspect availability and latency distributions, failure definitions, request eligibility, maintenance policy, and existing objectives.

## Core knowledge
Understand SLIs, SLOs, error budgets, rolling windows, good/valid event ratios, percentile limits, and dependency attribution.

## Procedure
1. Identify critical user-visible capabilities.
2. Define precise valid and good events.
3. Select availability, latency, correctness, freshness, or durability indicators as appropriate.
4. Establish targets from business tolerance and historical performance.
5. Choose evaluation windows and exclusions carefully.
6. Implement trustworthy measurements near the user experience.
7. Calculate error-budget consumption.
8. Connect objectives to alerting and release decisions.
9. Review objectives after meaningful architecture or traffic changes.

## Decision points
Prefer event-based SLIs when individual operations can be classified; use time-based measures for continuously available resources. Avoid targets so strict they create permanent budget exhaustion without business justification.

## Common failure patterns
Measuring infrastructure instead of users, hidden exclusions, denominator mistakes, vanity 100% targets, and objectives with no operational consequence.

## Verification
Recompute SLIs independently from sampled raw data and validate that known incidents affect the SLO as expected.

## Expected output
Documented SLIs/SLOs with formulas, sources, thresholds, ownership, and error-budget policy.

## Stop conditions
Stop when user-impact semantics or authoritative telemetry are insufficiently defined.