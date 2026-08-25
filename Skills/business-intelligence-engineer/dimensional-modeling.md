# Dimensional Modeling

## Purpose
Design fact and dimension structures that make analytical queries understandable, performant, and historically correct.

## When to use
Use for warehouses, marts, semantic models, and reporting datasets that need repeatable slicing, aggregation, and history.

## Inputs
Business processes, event grain, source schemas, keys, change history, reporting dimensions, retention requirements.

## Context to inspect
Inspect source transaction semantics, existing warehouse conventions, surrogate keys, late-arriving data, history requirements, and downstream joins.

## Core knowledge
Declare grain before columns. Facts represent measurable events or snapshots; dimensions provide descriptive context. Conformed dimensions support cross-process analysis. Slowly changing dimensions require deliberate history semantics.

## Procedure
1. Select the business process and declare exact fact grain.
2. Identify measures and classify additive behavior.
3. Identify dimensions required at that grain.
4. Choose durable business keys and warehouse surrogate keys where history demands them.
5. Select transaction, periodic snapshot, or accumulating snapshot pattern.
6. Define SCD behavior per attribute, not per table by habit.
7. Handle unknown, early-arriving, and late-arriving members explicitly.
8. Model degenerate dimensions and bridges only where semantically justified.
9. Validate joins preserve grain and do not multiply facts.
10. Test common queries, historical reconstruction, and incremental loads.

## Decision points
Use SCD Type 2 when historical attribute context matters; Type 1 when correction/current state is sufficient. Prefer a single fact grain over mixed-grain convenience tables.

## Common failure patterns
Mixed grain, natural-key joins across history, accidental fact multiplication, dimension snowflaking without benefit, incorrect semi-additive totals, and missing unknown members.

## Verification
Reconcile fact counts and measures to sources, test point-in-time joins, uniqueness constraints, historical changes, and representative aggregation paths.

## Expected output
Documented dimensional schema with grain, keys, history policy, load semantics, and validation evidence.

## Stop conditions
Stop when business process grain is ambiguous, history expectations are unresolved, or source identifiers cannot support reliable entity matching.