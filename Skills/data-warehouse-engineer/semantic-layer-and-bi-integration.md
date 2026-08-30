# Semantic Layer and BI Integration

## Purpose
Prepare warehouse models for consistent metric consumption across BI tools and analytical applications while preventing duplicated business logic.

## When to use
Use when multiple dashboards disagree, consumers repeatedly reimplement metrics, or a governed semantic layer is being introduced.

## Inputs
Business metric definitions, dimensional models, BI usage, user personas, query patterns, governance requirements.

## Context to inspect
Existing dashboards, calculated fields, semantic models, marts, joins, metric definitions, access policies, and performance hotspots.

## Core knowledge
A semantic layer should centralize reusable business definitions, expose understandable dimensions and measures, preserve declared grain, and avoid hiding fundamentally inconsistent source semantics. Warehouse models should support, not fight, semantic tooling.

## Procedure
1. Inventory critical metrics and conflicting definitions.
2. Trace each metric to authoritative warehouse fields and grain.
3. Define reusable measures, dimensions, and join relationships.
4. Validate aggregation and fanout behavior.
5. Expose governed date, currency, and organizational logic.
6. Remove duplicated BI-side calculations where safe.
7. Apply access rules consistent with warehouse policy.
8. Optimize high-frequency semantic queries.
9. Validate with representative dashboards and ad hoc exploration.
10. Publish ownership and metric documentation.

## Decision points
Place stable reusable logic in warehouse models or semantic definitions; keep presentation-only formatting in BI. Do not centralize unresolved business disagreement as if it were technical consensus.

## Common failure patterns
Hidden many-to-many fanout, inconsistent default filters, metric logic copied across dashboards, semantic models built directly on raw tables, and undocumented timezone or currency assumptions.

## Verification
Compare metrics across tools and known source reconciliations, test drill paths, and validate query performance for common usage.

## Expected output
A consistent semantic-ready warehouse interface with governed metrics and tested relationships.

## Stop conditions
Stop when metric ownership or business definitions remain unresolved.