# Volume and Completeness Monitoring

## Purpose
Detect missing, duplicated, truncated, or unexpectedly sparse data before consumers depend on it.

## When to use
Use for ingestion pipelines, partitioned tables, event streams, file drops, and curated models where row or object counts carry operational meaning.

## Inputs
Historical counts, expected source behavior, partition metadata, source totals when available, business seasonality, load manifests.

## Preconditions
Know whether counts should be stable, seasonal, event-driven, or intentionally sparse.

## Context to inspect
Review extraction boundaries, deduplication, partition keys, replay behavior, source-side counts, filters, joins, and late-arriving records.

## Core knowledge
Volume anomalies are useful but context dependent. Count equality is insufficient when duplicates replace missing rows or when legitimate business activity changes sharply. Completeness should combine cardinality, key coverage, partition presence, and reconciliation where possible.

## Procedure
1. Identify units to measure: rows, files, events, keys, partitions, or bytes.
2. Establish expected ranges by dataset and interval.
3. Add source-to-target reconciliation where trustworthy source totals exist.
4. Track unique-key counts and duplicate rates.
5. Detect missing partitions and incomplete windows.
6. Segment metrics by high-value dimensions only when actionable.
7. Incorporate seasonality or known campaign effects.
8. Alert on material deviation with lineage and ownership context.
9. Test truncation, duplication, and partial-load scenarios.
10. Review false positives and update thresholds deliberately.

## Decision points
Prefer deterministic reconciliation for regulated or financial data. Use statistical baselines when natural volume variation is high. Avoid high-cardinality monitoring that costs more than its diagnostic value.

## Common failure patterns
- Monitoring only total row count
- Comparing incompatible source and target windows
- Missing duplicates hidden by stable volume
- Treating backfills as incidents
- Ignoring partition-level completeness

## Verification
Replay known partial and duplicated loads and prove alerts distinguish them from legitimate volume shifts.

## Expected output
Validated volume, uniqueness, partition-completeness, and reconciliation controls.

## Stop conditions
Escalate when no reliable comparison boundary exists or source semantics make completeness unprovable.