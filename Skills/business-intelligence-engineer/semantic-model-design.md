# Semantic Model Design

## Purpose
Design governed analytical semantic models that translate source data into stable business concepts, measures, dimensions, and relationships.

## When to use
Use when creating or restructuring a BI dataset, metric layer, cube, or reusable reporting model. Do not use to bypass unresolved business definitions.

## Inputs
Business questions, source schemas, metric definitions, grain, reporting tools, security requirements, workload expectations.

## Context to inspect
Inspect existing models, naming conventions, source keys, refresh patterns, relationship cardinality, downstream reports, and known reconciliation issues.

## Core knowledge
Prefer explicit grain, conformed dimensions, reusable measures, predictable filter propagation, and business-facing names. Separate source-system shape from analytical shape. Minimize ambiguous many-to-many paths and hidden semantic coupling.

## Procedure
1. Identify consumers and decisions the model must support.
2. Define facts, dimensions, grain, keys, and authoritative metric definitions.
3. Map source fields to business concepts and document transformations.
4. Choose star-schema-oriented relationships unless another shape has a measured advantage.
5. Define reusable measures centrally rather than duplicating report logic.
6. Model time, currency, status, and slowly changing attributes explicitly.
7. Apply row/object security at the semantic boundary where appropriate.
8. Validate filter paths, null handling, totals, and aggregation behavior.
9. Test representative high-cardinality and cross-filter workloads.
10. Document ownership, lineage, assumptions, and compatibility constraints.

## Decision points
Choose denormalization when it improves analytical usability without creating inconsistent definitions. Use bridge tables for legitimate many-to-many relationships. Pre-aggregate only when measured workload and latency justify the operational cost.

## Common failure patterns
Mixed grain, bidirectional-filter ambiguity, duplicated measures, implicit business rules, unstable natural keys, fact-to-fact joins, excessive calculated columns, and security applied only in reports.

## Verification
Reconcile measures to trusted source totals; test slice-and-dice behavior, totals, security personas, refresh, and representative query latency. Implementation is complete only after evidence shows semantic correctness.

## Expected output
A reusable semantic model with documented grain, relationships, measures, security, lineage, and validation evidence.

## Stop conditions
Stop when metric ownership is unresolved, source keys cannot support the intended grain, security requirements are unknown, or reconciliation evidence contradicts assumptions.