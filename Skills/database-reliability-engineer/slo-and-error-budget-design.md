# SLO and Error Budget Design

## Purpose
Define measurable database reliability targets that connect user impact to engineering priorities.

## When to use
Use when establishing or revising availability, latency, durability, freshness, or recovery expectations.

## Inputs
Critical workloads, user journeys, historical metrics, incident history, business impact, and platform constraints.

## Context to inspect
Identify databases, replicas, clients, dependencies, maintenance windows, telemetry, and existing SLAs.

## Core knowledge
SLIs must measure outcomes users experience. SLOs need explicit windows and thresholds. Error budgets turn reliability targets into decision constraints rather than vague aspirations.

## Procedure
1. Identify critical database-backed journeys.
2. Select outcome-oriented SLIs.
3. Define measurement windows and exclusions narrowly.
4. Set achievable targets from business need and evidence.
5. Calculate error budgets.
6. Define burn-rate alerts.
7. Establish actions when budgets are healthy or exhausted.
8. Review targets after material architecture or workload changes.

## Decision points
Prefer stricter targets only when business impact justifies operational cost. Separate workload classes when one target would hide materially different risk.

## Common failure patterns
Using infrastructure uptime as the only SLI, setting 100% targets, excluding incidents after the fact, and creating SLOs without response policy.

## Verification
Confirm SLIs can be computed from production telemetry, alert tests work, historical data produces plausible budgets, and stakeholders understand consequences.

## Expected output
Documented SLIs, SLOs, error budgets, burn alerts, and operating policy.

## Stop conditions
Escalate when business criticality is unknown, telemetry cannot measure the proposed SLI, or contractual commitments conflict with feasible targets.