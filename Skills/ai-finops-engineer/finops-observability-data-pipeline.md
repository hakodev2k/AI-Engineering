# FinOps Observability Data Pipeline

## Purpose
Build reliable cost-and-usage telemetry that joins cloud bills, vendor usage, accelerator metrics, and workload metadata into a decision-ready AI FinOps dataset.

## When to use
Use when cost analysis depends on manual spreadsheets, billing data cannot be traced to workloads, or operational and financial telemetry live in disconnected systems.

## Inputs
- Billing exports
- Model API usage
- GPU/cluster telemetry
- Scheduler/job metadata
- Ownership/tagging sources
- Pricing and discount data

## Context to inspect
Inspect source freshness, identifiers, schemas, time zones, billing adjustments, credits, tags, namespaces, service accounts, and retention.

## Core knowledge
AI FinOps requires both financial truth and operational context. Pipelines must preserve raw source data, normalize currencies/units, handle late adjustments, and expose attribution coverage and reconciliation quality.

## Procedure
1. Inventory authoritative billing and usage sources.
2. Define canonical resource, workload, model, owner, and time dimensions.
3. Preserve immutable raw ingests for auditability.
4. Normalize currencies, units, timestamps, and provider naming.
5. Join financial data to operational identifiers.
6. Apply documented allocation and discount logic.
7. Handle credits, refunds, late invoices, and rebills explicitly.
8. Add data-quality checks for completeness, duplicates, freshness, and reconciliation.
9. Publish curated cost facts and unit-economics views.
10. Version transformation logic and allocation rules.
11. Monitor pipeline failures and attribution coverage.
12. Reconcile curated totals to source billing regularly.

## Decision points
Use daily or hourly pipelines when intervention speed matters; monthly-only processing is acceptable for low-volatility costs. Keep estimates separate from finalized invoice data.

## Common failure patterns
Overwriting raw bills, mixing list and net cost, silently dropping untagged spend, joining on unstable labels, and failing to process invoice corrections.

## Verification
Confirm totals reconcile to authoritative sources, sampled workloads trace end-to-end, freshness SLOs are met, and schema changes trigger visible failures rather than silent corruption.

## Expected output
A governed FinOps data pipeline with canonical schemas, quality checks, reconciliation, lineage, and consumable cost datasets.

## Stop conditions
Stop when authoritative sources cannot be identified, joins would expose restricted data improperly, or reconciliation gaps exceed agreed tolerance without explanation.