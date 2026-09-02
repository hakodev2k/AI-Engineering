# Token and Cost Observability

## Purpose
Make AI inference and orchestration cost attributable, explainable, and optimizable without sacrificing reliability or quality.

## When to use
Use when spend grows unexpectedly, introducing new models, designing budgets, or investigating unit economics.

## Inputs
Provider pricing, token usage, cache usage, request metadata, model routing, retries, and business dimensions.

## Context to inspect
Inspect pricing versions, prompt/context construction, output limits, retries, fallbacks, embeddings, reranking, tools, batch jobs, and provider invoices.

## Core knowledge
AI cost is workload-dependent. Request count alone is insufficient; input/output tokens, cached tokens, model class, batch mode, embeddings, reranking, and failed/retried work all matter. Cost telemetry should be versioned because provider pricing changes.

## Procedure
1. Enumerate every billable AI operation in a user journey.
2. Capture usage counters returned by providers where available.
3. Define normalized cost formulas with effective-date pricing tables.
4. Attribute cost to model, route, feature, tenant class, environment, and outcome using bounded dimensions.
5. Track cost per successful request and per business unit of work.
6. Separate retry/fallback waste from necessary inference.
7. Reconcile telemetry aggregates with provider invoices.
8. Alert on anomalous unit-cost changes, not merely total spend.
9. Identify optimization candidates and validate quality/reliability before changing them.

## Decision points
Use estimated tokenization only when authoritative usage is unavailable. Prefer unit-cost budgets over blunt request limits when workloads vary greatly.

## Common failure patterns
Stale prices, ignoring failed calls, double-counting fallbacks, mixing currencies, missing cached-token discounts, and optimizing cost while degrading answer quality.

## Verification
Compare sampled requests with provider usage records and reconcile daily aggregates to invoices within an agreed tolerance.

## Expected output
Cost metrics, pricing configuration, attribution dashboards, anomaly alerts, and reconciliation evidence.

## Stop conditions
Stop if billing semantics are unknown, pricing cannot be versioned, or requested attribution would expose sensitive tenant information.