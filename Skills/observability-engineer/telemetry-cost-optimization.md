# Telemetry Cost Optimization

## Purpose
Reduce observability spend without removing the evidence required for reliability, security, and production diagnosis.

## When to use
Use during cost reviews, rapid telemetry growth, retention redesign, or platform migration.

## Inputs
Billing data, ingestion volume, retention, query frequency, cardinality, sampling, and operational requirements.

## Context to inspect
Inspect cost by signal, service, environment, index, retention tier, unused fields, duplicate telemetry, and expensive queries.

## Core knowledge
Cost optimization must start with value, not blanket deletion. Ingestion, indexing, retention, query compute, egress, and cardinality can each dominate depending on the platform.

## Procedure
1. Establish cost baseline by source and signal.
2. Identify high-cost low-value telemetry.
3. Remove duplicates and noisy events.
4. Reduce unnecessary dimensions and indexes.
5. Apply sampling where evidence permits.
6. Tier retention by operational value.
7. Optimize expensive dashboards and queries.
8. Set service-level telemetry budgets.
9. Revalidate incident and SLO coverage.

## Decision points
Retain high-value error and audit evidence longer than routine debug data. Prefer schema/cardinality fixes before aggressive sampling when possible.

## Common failure patterns
Across-the-board retention cuts, disabling telemetry during cost pressure, optimizing only storage, and ignoring developer query patterns.

## Verification
Measure spend reduction and run incident scenarios to ensure diagnostic capability and SLO calculations remain intact.

## Expected output
A quantified cost-reduction plan with preserved observability outcomes.

## Stop conditions
Escalate when proposed savings conflict with compliance, audit, or contractual retention requirements.