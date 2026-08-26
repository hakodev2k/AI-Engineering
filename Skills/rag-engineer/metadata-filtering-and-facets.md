# Metadata Filtering and Facets

## Purpose
Use metadata to constrain retrieval by tenant, product, date, document type, jurisdiction, or other reliable dimensions.

## When to use
Use when relevance or security depends on structured scope.

## Inputs
Metadata schema, query constraints, ACL model, index filter capabilities, representative records.

## Context to inspect
Inspect metadata completeness, cardinality, normalization, null semantics, update behavior, and whether filters execute before or after ANN search.

## Core knowledge
Filters can improve precision and enforce scope, but missing or inconsistent metadata causes silent recall loss. Security filters require fail-closed semantics.

## Procedure
1. Separate security filters from relevance preferences.
2. Define canonical field types and values.
3. Validate metadata at ingestion.
4. Translate explicit user constraints deterministically where possible.
5. Apply mandatory tenant/ACL filters before exposing results.
6. Benchmark high- and low-selectivity filters.
7. Handle unknown/null values explicitly.
8. Test filter combinations and temporal boundaries.
9. Monitor filtered zero-result rates.
10. Version schema changes and backfill safely.

## Decision points
Use filters for hard constraints and ranking features for soft preferences. Denormalize metadata when the retrieval backend requires it and consistency can be maintained.

## Common failure patterns
Using inferred metadata as authorization; inconsistent date zones; high-cardinality filters degrading ANN recall; null values accidentally broadening scope.

## Verification
Test positive/negative scope cases, ACL isolation, boundary values, performance, and metadata reconciliation.

## Expected output
A typed filtering contract with security and relevance semantics clearly separated.

## Stop conditions
Stop when required security metadata is missing or cannot be trusted.