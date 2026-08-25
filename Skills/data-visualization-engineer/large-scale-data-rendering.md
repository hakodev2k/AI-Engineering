# Large-Scale Data Rendering

## Purpose
Preserve useful visual patterns and responsive interaction when datasets exceed practical browser or chart-library limits.

## When to use
For high-cardinality scatterplots, dense time series, event streams, maps, or large tables.

## Inputs
Row/mark counts, distribution, user tasks, latency budget, available aggregation infrastructure, device constraints.

## Core knowledge
Rendering every record is rarely necessary. Level of detail, binning, aggregation, sampling, tiling, virtualization, and GPU rendering solve different problems. Reduction must preserve the patterns users need to detect.

## Procedure
1. Define the analytical task and required resolution.
2. Measure data transfer, transform, memory, layout, and paint costs.
3. Determine whether exact individual marks are necessary.
4. Apply server aggregation, spatial/temporal binning, or precomputed tiles when appropriate.
5. Use representative sampling only with documented statistical limitations.
6. Introduce level-of-detail behavior across zoom or filter states.
7. Virtualize tabular or list views.
8. Consider canvas/WebGL when SVG/DOM mark counts dominate cost.
9. Preserve drill access to exact records where required.
10. Benchmark worst realistic states.

## Decision points
Use aggregation for density/pattern tasks, virtualization for sequential browsing, and GPU rendering when individual marks remain necessary at scale.

## Common failure patterns
Rendering all raw points; sampling rare events away; client-side aggregation of unbounded payloads; no resolution change on zoom; optimizing renderer while query dominates latency.

## Verification
Compare reduced and full-data conclusions on test datasets, measure budgets, and validate rare-event visibility requirements.

## Expected output
A scalable rendering strategy with explicit fidelity, latency, and memory trade-offs.

## Stop conditions
Stop when required exactness and available infrastructure cannot meet performance targets without product-level trade-offs.