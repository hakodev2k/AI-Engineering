# Metadata Filtering

## Purpose
Design efficient, correct metadata filtering around vector retrieval while preserving recall and tenant/security boundaries.

## When to use
Use for faceted search, ACLs, tenant filters, date/category constraints, or slow filtered ANN queries.

## Inputs
Filter predicates, cardinalities/selectivity, query frequencies, security requirements, corpus distribution, and index capabilities.

## Context to inspect
Inspect metadata schema/types, filter indexes, execution plans, pre/post-filter behavior, ANN parameters, skew, and authorization path.

## Core knowledge
Pre-filtering reduces candidate space but may starve ANN traversal; post-filtering can waste retrieval work and return too few results. Selectivity, correlation with vector neighborhoods, and engine implementation determine performance. Security filters must be mandatory and fail closed.

## Procedure
1. Inventory predicates and distinguish security from relevance filters.
2. Measure field cardinality, selectivity, nulls, and skew.
3. Confirm metadata types and indexes.
4. Determine engine pre-, post-, or hybrid-filter semantics.
5. Benchmark representative selectivity bands.
6. Tune candidate counts/ANN search effort for filtered workloads.
7. Test combinations, empty matches, and high-cardinality values.
8. Validate tenant/ACL filters cannot be bypassed.
9. Monitor filtered-query recall and tail latency separately.

## Decision points
Prefer pre-filtering for restrictive mandatory predicates when supported efficiently. Post-filter only when candidate expansion can reliably satisfy result counts. Consider partitioning when a stable high-level boundary dominates queries and isolation benefits justify operational cost.

## Common failure patterns
Treating authorization as optional metadata; indexing every field; stringly typed metadata; ignoring skew; fixed candidate counts for all selectivities; returning fewer than requested results without signaling; unbounded filter expressions.

## Verification
Use exact filtered search as a quality baseline, load-test selectivity classes, inspect plans, and run negative tenant/ACL tests.

## Expected output
A filtering strategy, schema/index changes, tuning values, and security/quality evidence.

## Stop conditions
Stop if authorization semantics are unclear, filter behavior is undocumented, or tests risk exposing cross-tenant data.