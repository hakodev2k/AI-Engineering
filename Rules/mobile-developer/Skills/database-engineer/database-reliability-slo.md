# Database Reliability and SLO Engineering

## Purpose
Translate application reliability needs into measurable database objectives, operating limits, and engineering priorities.

## When to use
Use when defining production standards, prioritizing reliability work, reviewing architecture, or recurring incidents lack clear reliability targets.

## Inputs
Service SLOs, dependency topology, latency/error budgets, RPO/RTO, workload criticality, incident history, and database telemetry.

## Context to inspect
Inspect which user journeys depend on each database, availability architecture, query latency distributions, maintenance, backups, failover, and known single points of failure.

## Core knowledge
Database reliability should support user-facing service objectives. Not every database requires identical availability; overengineering low-criticality data can waste cost while underprotecting critical state.

## Procedure
1. Map databases to user-facing services and critical journeys.
2. Define availability and latency expectations by workload tier.
3. Establish RPO/RTO and durability requirements.
4. Identify failure modes that can consume the error budget.
5. Measure current reliability against objectives.
6. Prioritize HA, backup, capacity, query, and operational improvements by risk reduction.
7. Define maintenance and change policies consistent with objectives.
8. Create reliability dashboards and review cadence.
9. Use incidents and near misses to update controls.
10. Revisit objectives as business criticality changes.

## Decision points
Invest most in failure modes with meaningful probability and impact. Accept explicit residual risk where mitigation cost exceeds business value.

## Common failure patterns
Treating uptime as the only reliability metric, identical HA for every database, undefined recovery objectives, and reliability work disconnected from service impact.

## Verification
Demonstrate metrics, failover/recovery drills, and incident outcomes against stated objectives.

## Expected output
Tiered database reliability objectives, measured gaps, and prioritized engineering actions.

## Stop conditions
Escalate when business criticality or recovery tolerance has no accountable owner.