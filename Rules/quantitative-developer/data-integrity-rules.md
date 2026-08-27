# Data Integrity Rules

## Purpose
Prevent incorrect quantitative decisions caused by corrupted, ambiguous, stale, or silently changed data.

## Scope
Applies to market, reference, fundamental, alternative, portfolio, transaction, and derived datasets.

## MUST
- Every production dataset MUST have defined ownership, provenance, schema, units, timestamps, timezone, and freshness expectations.
- Ingestion MUST validate schema, ranges, duplicates, missingness, ordering, and key referential constraints appropriate to the dataset.
- Corporate actions, symbol changes, contract rolls, corrections, and restatements MUST be handled explicitly when relevant.
- Derived data MUST be reproducible from versioned inputs and transformations.
- Material data anomalies MUST fail closed or quarantine affected outputs when silent continuation could alter financial decisions.

## MUST NOT
- Missing values MUST NOT be silently converted to zero or another economically meaningful value.
- Production logic MUST NOT depend on undocumented manual edits.
- Data from different clocks or conventions MUST NOT be joined without explicit normalization.

## SHOULD
- Maintain quality metrics and historical baselines for critical feeds.
- Preserve raw immutable inputs when licensing and storage constraints permit.

## Exceptions
Exceptions require documented source limitations, impact analysis, compensating validation, expiry criteria, and accountable approval.

## Verification
Inspect lineage, schema checks, reconciliation reports, anomaly metrics, transformation tests, sample records across boundary dates, and reproducibility from retained source versions.