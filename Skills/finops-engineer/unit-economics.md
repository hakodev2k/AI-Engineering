# Cloud Unit Economics

## Purpose
Connect cloud spend to business or technical units so teams optimize cost per outcome instead of minimizing total spend blindly.

## When to use
Use when growth makes absolute spend misleading, comparing product efficiency, setting cost targets, or evaluating architecture changes.

## Inputs
Allocated cloud costs, product metrics, transactions, customers, requests, workloads, revenue or other meaningful business units.

## Context to inspect
Inspect cost boundaries, shared allocations, metric definitions, volume changes, quality/SLO changes, and whether the unit causally relates to resource consumption.

## Core knowledge
A unit metric must be stable, decision-relevant, and consistently measured. Lower cost per unit is valuable only if product quality and business outcomes are preserved.

## Procedure
1. Identify the decision the unit metric should support.
2. Choose one or more meaningful denominators.
3. Align cost and usage time windows and scope.
4. Allocate shared costs consistently.
5. Calculate baseline unit cost and its components.
6. Segment by product, tenant, region, workload, or tier when useful.
7. Explain changes through price, architecture, utilization, and volume.
8. Pair cost metrics with service quality and business outcome metrics.
9. Set targets only after understanding natural variability.
10. Track trends and validate after optimizations.

## Decision points
Prefer technical units for engineering optimization and business units for product/finance decisions. Use multiple metrics when one denominator hides important behavior.

## Common failure patterns
Dividing unrelated totals, changing denominator definitions, ignoring shared cost, celebrating lower cost caused by degraded service, and comparing products with different cost boundaries.

## Verification
Metric calculations reconcile to allocated spend; denominator source is authoritative; historical recomputation is stable; stakeholders agree on interpretation.

## Expected output
Defined unit-cost metrics, calculation lineage, baseline, drivers, targets, and decision guidance.

## Stop conditions
Stop when cost and denominator scopes cannot be aligned or the proposed metric encourages harmful optimization.