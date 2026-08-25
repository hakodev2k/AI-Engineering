# Data Profiling for Visualization

## Purpose
Establish whether data is structurally and statistically fit for trustworthy visualization.

## When to use
Before designing charts from unfamiliar, changed, or incident-prone datasets.

## Inputs
Dataset or query, schema, lineage, business definitions, expected ranges and cardinalities.

## Context to inspect
Inspect types, nullability, keys, grain, joins, timestamps, units, category cardinality, outliers, missing periods, duplicates, and lineage.

## Core knowledge
Visual errors often originate upstream. Profiling must distinguish missing from zero, event time from processing time, identifiers from measures, and valid extremes from corrupt records. Aggregation can conceal quality defects.

## Procedure
1. Confirm dataset grain and candidate keys.
2. Profile row counts, nulls, distinct counts, ranges, distributions, and temporal coverage.
3. Test uniqueness and referential assumptions used by joins.
4. Check units, currencies, time zones, encodings, and category normalization.
5. Compare actual cardinalities with intended visual encodings.
6. Locate gaps, duplicates, late-arriving data, and suspicious discontinuities.
7. Reconcile critical totals against an authoritative source.
8. Document transformations required before visualization.
9. Flag uncertainty or incomplete coverage visibly rather than silently imputing it.

## Decision points
Aggregate before rendering when row-level detail is unnecessary; preserve raw detail when drill-through or anomaly diagnosis requires it. Treat imputation as a domain decision, not a cosmetic visualization fix.

## Common failure patterns
Charting duplicate facts; accidental many-to-many joins; interpreting null as zero; sorting numeric strings lexically; ignoring timezone boundaries; visualizing identifiers as quantities.

## Verification
Re-run profiling checks on the transformed dataset, reconcile totals, and spot-check records behind extrema and gaps.

## Expected output
A visualization-ready data assessment listing grain, quality risks, transformations, reconciliation evidence, and unresolved assumptions.

## Stop conditions
Stop when the data grain cannot be established, totals materially fail reconciliation, or transformations would require undocumented business assumptions.