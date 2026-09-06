# Temporal Semantics Rules

## Purpose
Preserve correct meaning for facts that change over time.

## Scope
Valid time, transaction time, effective dates, event time, intervals, corrections, and historical queries.

## MUST
- Time-dependent facts MUST define whether timestamps represent valid time, observation time, ingestion time, or another explicit semantic.
- Interval boundaries MUST have documented inclusivity semantics.
- Historical corrections MUST preserve enough history to distinguish corrected knowledge from previously stored knowledge when required.
- Temporal joins MUST use the time dimension appropriate to the consumer's question.

## MUST NOT
- MUST NOT substitute ingestion time for business-effective time without explicit justification.
- MUST NOT overwrite historical state when auditability or temporal reconstruction is required.
- MUST NOT compare timestamps without normalized timezone and precision semantics.

## SHOULD
- Model temporal validity separately from system processing metadata.
- Use deterministic rules for overlapping intervals.

## Exceptions
Simplified temporal models require documented limitations and consumer acceptance.

## Verification
Review temporal schemas, boundary tests, historical queries, and correction scenarios.