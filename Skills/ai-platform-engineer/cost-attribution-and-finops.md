# Cost Attribution and FinOps

## Purpose
Make AI platform spend measurable, attributable, forecastable, and governable across teams, environments, models, and workloads.

## When to use
Use when AI spend grows faster than expected, teams share provider accounts, budgets cannot be reconciled, or platform owners need chargeback/showback controls.

## Inputs
- Provider billing exports
- Model pricing dimensions
- Tenant and workload metadata
- Budget targets
- Usage telemetry

## Context to inspect
Inspect token accounting, image/audio billing units, cached input pricing, batch discounts, GPU utilization, provider invoices, model gateway telemetry, environment tags, and historical spend anomalies.

## Core knowledge
AI cost is multidimensional and provider-specific. Reliable attribution requires joining request-level usage with authoritative pricing and tenant metadata. FinOps decisions should optimize cost per useful outcome, not merely cost per token.

## Procedure
1. Inventory all billable AI resources and pricing dimensions.
2. Define tenant, team, environment, product, and workload attribution keys.
3. Capture request-level usage where providers expose it.
4. Reconcile platform usage with provider invoices.
5. Version pricing tables and effective dates.
6. Calculate unit economics such as cost per request, task, user, or successful outcome.
7. Build budget and anomaly alerts.
8. Identify idle GPU capacity, oversized models, wasteful retries, and excessive context.
9. Define quota or approval policies for expensive workload classes.
10. Model savings before changing quality-critical behavior.
11. Track realized savings after changes.
12. Publish transparent showback reports.

## Decision points
Use chargeback when organizational incentives require it; showback may be sufficient for early-stage platforms. Prefer smaller models only when evaluations confirm acceptable quality.

## Common failure patterns
Using invoice totals without workload attribution, stale price tables, missing retry costs, ignoring failed requests, optimizing token count while reducing task success, and hidden shared-account spend.

## Verification
Verify request totals against provider billing, validate pricing versions, sample tenant assignments, and confirm savings experiments preserve target quality and SLOs.

## Expected output
A reconciled AI cost model, team-level attribution, unit economics, budget controls, and evidence-based optimization opportunities.

## Stop conditions
Stop when usage cannot be mapped to tenants reliably or provider billing data is incomplete enough to make financial conclusions unsafe.