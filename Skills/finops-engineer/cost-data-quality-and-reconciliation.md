# Cost Data Quality and Reconciliation

## Purpose
Ensure FinOps decisions use complete, consistent, traceable cost data that reconciles to provider bills and finance-approved totals.

## When to use
Use when dashboards disagree, allocation totals drift, billing pipelines change, or cost data feeds new financial processes.

## Inputs
Provider billing exports, invoices, transformed datasets, allocation tables, currency rates, commitment/credit data, pipeline logs.

## Context to inspect
Inspect ingestion completeness, late-arriving records, schema changes, duplicate rows, amortization, credits/refunds, taxes, marketplace charges, FX, and transformation logic.

## Core knowledge
Cloud billing data is mutable and can arrive late. Reconciliation needs explicit cost basis, period, currency, and tolerance. Data lineage is essential for trustworthy decisions.

## Procedure
1. Define authoritative sources and reconciliation targets.
2. Document gross, net, amortized, and invoiced cost fields.
3. Validate record counts, dates, currencies, and billing accounts.
4. Detect duplicates, gaps, and schema drift.
5. Reconcile raw export to provider totals.
6. Reconcile transformations and allocations stepwise.
7. Account explicitly for credits, refunds, taxes, and late adjustments.
8. Establish quality checks and tolerances in the pipeline.
9. Quarantine suspect periods rather than silently publishing.
10. Record lineage and correction history.

## Decision points
Use invoice totals for finance reconciliation and detailed exports for operational analysis; differences must be explained, not forced away.

## Common failure patterns
Summing incompatible cost fields, ignoring late data, silently dropping unknown SKUs, converting currency inconsistently, and publishing dashboards before reconciliation.

## Verification
Source totals reconcile within approved tolerance; pipeline checks detect injected failures; lineage reproduces reported metrics; adjustments are auditable.

## Expected output
A reconciliation report, quality rules, lineage map, exception log, and trusted reporting dataset.

## Stop conditions
Stop publication when unexplained variance exceeds tolerance or source schema changes invalidate transformations.