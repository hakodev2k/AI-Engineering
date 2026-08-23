# Data Quality Rules

## Purpose
Keep growth decisions from being corrupted by incomplete, duplicated, delayed, or inconsistent data.

## Scope
Event pipelines, warehouse models, experiment datasets, attribution data, and growth dashboards.

## MUST
- Define freshness, completeness, uniqueness, and validity expectations for decision-critical datasets.
- Detect and investigate material data-quality deviations before publishing conclusions.
- Preserve lineage from reported metrics to authoritative sources and transformations.

## MUST NOT
- Backfill or repair data silently when it changes historical conclusions.
- Mix known-bad periods into analysis without disclosure or correction.

## SHOULD
- Automate checks for critical event volumes, schema drift, duplicates, nulls, and freshness.

## Exceptions
Preliminary analysis may use imperfect data only when limitations and likely decision impact are explicit.

## Verification
Inspect pipeline checks, lineage, reconciliation queries, anomaly alerts, sample records, and documented repairs.