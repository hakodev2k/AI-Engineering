# Billing Data Quality Rules

## Purpose
Protect financial decisions from incomplete, duplicated, stale, or misinterpreted billing data.

## Scope
Billing exports, invoices, usage records, credits, taxes, discounts, amortization, currency conversion, and cost pipelines.

## MUST
- Identify authoritative sources and document ingestion latency, schema, accounting basis, and reconciliation controls.
- Detect missing partitions, duplicates, schema drift, unexpected nulls, and material total mismatches.
- Reconcile reporting datasets to provider invoices or authoritative billing statements at an agreed tolerance.
- Preserve raw source data and transformation lineage required for audit and reproduction.

## MUST NOT
- Publish materially incomplete data as final without visible qualification.
- Mix amortized, blended, unblended, list, and net cost concepts without explicit definitions.
- Silently discard credits, refunds, taxes, or adjustments that affect the stated metric.

## SHOULD
- Automate data-quality checks before downstream dashboards and allocation jobs run.

## Exceptions
Provisional reporting is allowed when latency is understood and clearly labeled.

## Verification
Run reconciliation, completeness, uniqueness, schema, freshness, lineage, and sample invoice-to-report checks.