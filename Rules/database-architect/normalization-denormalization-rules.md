# Normalization and Denormalization

## Purpose
Balance integrity, maintainability, and performance in schema design.

## Scope
Relational schemas, document structures, materialized projections, and duplicated attributes.

## MUST
- Normalization level MUST be chosen from documented access patterns and integrity requirements.
- Every intentional denormalization MUST identify the authoritative source and synchronization mechanism.
- Derived structures MUST define rebuild or repair procedures.
- Denormalization for performance MUST be supported by workload measurements or query-plan evidence.

## MUST NOT
- MUST NOT denormalize solely to avoid writing correct joins.
- MUST NOT duplicate mutable business facts without defined consistency behavior.
- MUST NOT trade away critical integrity without an explicit compensating control.

## SHOULD
- Prefer normalized authoritative models and purpose-built projections for read optimization.
- Prefer deterministic regeneration of derived data where practical.

## Exceptions
Exceptions require evidence, consistency risk analysis, repair plan, and technical approval.

## Verification
Inspect schema, query plans, synchronization code, reconciliation checks, and rebuild procedures.