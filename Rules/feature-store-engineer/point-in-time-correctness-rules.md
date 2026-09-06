# Point-in-Time Correctness Rules

## Purpose
Prevent training-serving leakage by ensuring historical feature values reflect only information available at prediction time.

## Scope
Historical joins, event timestamps, effective timestamps, late data, windows, and training dataset generation.

## MUST
- Historical feature retrieval MUST use event-time semantics appropriate to the feature.
- Training joins MUST exclude information that became available after the prediction timestamp.
- Windowed aggregates MUST define inclusion boundaries precisely.
- Late-arriving data handling MUST be documented and reproducible.
- Point-in-time correctness MUST be tested with synthetic cases that expose leakage.

## MUST NOT
- MUST NOT build training datasets using current-state lookups when historical state is required.
- MUST NOT use processing time as a substitute for event time without explicit justification.
- MUST NOT backfill historical values in a way that rewrites what was knowable at prediction time unless the use case explicitly requires corrected history.

## SHOULD
- Preserve source timestamps and ingestion timestamps separately.
- Prefer deterministic historical join implementations.

## Exceptions
Exceptions require explicit modeling rationale, leakage assessment, and reviewer approval.

## Verification
Inspect historical join logic, boundary tests, late-data tests, and sampled reconstructed timelines.