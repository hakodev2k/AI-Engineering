# Offline Store Rules

## Purpose
Maintain reliable, reproducible historical feature storage for training, analysis, and backfills.

## Scope
Offline feature tables, partitions, retention, schema, storage layout, and historical retrieval.

## MUST
- Offline feature datasets MUST have defined partitioning and retention strategies aligned to access patterns.
- Historical values MUST be reproducible from versioned transformations and source lineage.
- Schema evolution MUST preserve compatibility or provide an explicit migration path.
- Large scans MUST be bounded by partitions or predicates appropriate to the workload.
- Retention changes affecting reproducibility MUST be reviewed before execution.

## MUST NOT
- MUST NOT overwrite historical partitions destructively without rollback or regeneration evidence.
- MUST NOT depend on unordered data when deterministic output is required.
- MUST NOT expose unrestricted sensitive feature datasets.

## SHOULD
- Store only materialized history needed for reproducibility, performance, or compliance.
- Use storage formats and layouts that support predicate and column pruning.

## Exceptions
Exceptions require cost, reproducibility, and consumer-impact analysis.

## Verification
Review partition plans, query profiles, retention policy, schema history, and reproducibility tests.