# Data Warehouse Design

## Purpose
Design analytical warehouses that provide understandable business models, predictable query performance, and controlled historical truth.

## When to use
Use for BI, reporting, governed metrics, dimensional marts, and enterprise analytical integration.

## Inputs
Business processes, reporting requirements, source systems, history rules, dimensions, measures, volumes, and BI access patterns.

## Context to inspect
Inspect existing semantic definitions, source keys, slowly changing attributes, late facts, fiscal calendars, security requirements, and common joins.

## Core knowledge
Dimensional models optimize comprehension and analytical access. Facts require explicit grain; dimensions provide descriptive context. Conformed dimensions and consistent metric definitions reduce contradictory reporting.

## Procedure
1. Prioritize business processes and questions.
2. Declare fact grain before selecting measures.
3. Identify dimensions and conformed attributes.
4. Choose surrogate and business key strategy.
5. Define slowly changing dimension behavior.
6. Handle late-arriving facts and dimensions.
7. Design incremental loads and reconciliation.
8. Add aggregate or materialized structures only from evidence.
9. Apply row/column security where needed.
10. Validate reports against authoritative source totals.

## Decision points
Use star schemas when usability and BI performance dominate. Preserve normalized core models only when integration or governance needs justify additional layers.

## Common failure patterns
Mixed-grain facts, duplicated metric logic across reports, overwriting history unintentionally, joining on mutable descriptive fields, and premature aggregates.

## Verification
Reconcile key measures, test historical changes, inspect representative query plans, and confirm BI users can derive intended metrics without ambiguous joins.

## Expected output
A documented warehouse model with fact grains, dimensions, history, load semantics, security, and reconciliation evidence.

## Stop conditions
Stop when metric definitions conflict, source history cannot support required reporting, or regulated data access rules are unresolved.