# Performance and Cost Rules

## Purpose
Keep analytical workloads efficient without sacrificing correctness.

## Scope
Warehouse queries, extracts, dashboards, notebooks, and recurring transformations.

## MUST
- Measure runtime, scanned data, or equivalent cost for expensive recurring workloads.
- Reduce unnecessary columns, rows, repeated scans, and redundant recomputation.
- Preserve correctness when optimizing queries or materializations.
- Evaluate freshness-versus-cost trade-offs for recurring outputs.

## MUST NOT
- MUST NOT claim optimization without before-and-after evidence.
- MUST NOT degrade metric correctness or freshness silently to reduce cost.

## SHOULD
- Reuse governed intermediate datasets when they reduce cost without introducing stale or ambiguous logic.

## Exceptions
Small ad hoc queries may prioritize analyst speed when resource impact is negligible.

## Verification
Compare execution metrics, warehouse cost, query plans where available, and result equivalence before and after changes.