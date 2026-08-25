# Visualization Performance Engineering

## Purpose
Diagnose and improve end-to-end latency, rendering cost, memory use, and interaction responsiveness in analytical interfaces.

## When to use
When dashboards load slowly, interactions lag, browsers consume excessive resources, or data volume grows.

## Inputs
Performance traces, query timings, payload sizes, render timings, data volumes, interaction flows.

## Core knowledge
Latency spans data source, semantic/query layer, network, transformation, rendering, and browser interaction. Optimize the measured bottleneck. Reducing marks and payload often matters more than micro-optimizing drawing code.

## Procedure
1. Define performance budgets for initial load and key interactions.
2. Capture baseline timings by layer.
3. Identify dominant query, transfer, transform, layout, paint, or scripting cost.
4. Reduce unnecessary fields, rows, precision, and duplicate requests.
5. Pre-aggregate where detail is not required.
6. Add caching only with explicit freshness semantics.
7. Use virtualization, progressive rendering, sampling, or level-of-detail strategies for dense views.
8. Debounce expensive interactions.
9. Re-measure under realistic data and network conditions.
10. Add regression monitoring for critical budgets.

## Decision points
Prefer server aggregation when raw volume is large; client aggregation can improve interaction when bounded datasets fit memory. Sampling is acceptable for exploratory pattern finding only when limitations are visible.

## Common failure patterns
Optimizing without traces; fetching unused columns; rendering millions of marks; cache without invalidation; benchmarking toy datasets; hiding latency behind indefinite spinners.

## Verification
Compare before/after traces at representative percentiles and verify analytical results remain equivalent.

## Expected output
A measured performance improvement with bottleneck evidence, budgets, trade-offs, and regression checks.

## Stop conditions
Stop when optimization would alter metric semantics, violate freshness requirements, or require infrastructure changes outside authority.