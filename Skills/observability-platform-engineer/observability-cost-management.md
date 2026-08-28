# Observability Cost Management

## Purpose
Control observability spend without degrading incident detection, forensic value, or reliability decision-making.

## When to use
Use when telemetry costs grow faster than workload value, quotas are needed, or platform teams must allocate spend by service or tenant.

## Inputs
Billing data, ingestion volume, retention, cardinality, query usage, ownership metadata, SLO criticality.

## Context to inspect
Inspect top cost contributors, unused telemetry, duplicate ingestion, sampling, retention tiers, and tenant growth.

## Core knowledge
Understand ingestion pricing, storage amplification, query cost, cardinality, sampling, aggregation, tiering, and chargeback/showback.

## Procedure
1. Attribute spend to teams, services, signals, and environments.
2. Rank telemetry by operational value and cost.
3. Remove duplicates and low-value high-volume events.
4. Reduce cardinality and excessive payload fields.
5. Tune sampling and retention by criticality.
6. Move old data to cheaper tiers where appropriate.
7. Set budgets, quotas, and growth alerts.
8. Validate that cost changes preserve incident and SLO use cases.

## Decision points
Optimize high-volume low-value data first. Preserve security, audit, and rare-failure evidence when business risk outweighs storage savings.

## Common failure patterns
Blanket sampling, deleting data before understanding incident use, optimizing only storage while ignoring query cost, and no cost ownership.

## Verification
Compare spend, ingestion, cardinality, and representative incident workflows before and after changes.

## Expected output
A cost reduction plan with quantified savings, risk controls, and ownership.

## Stop conditions
Stop when required audit, legal, or critical incident telemetry would be compromised.