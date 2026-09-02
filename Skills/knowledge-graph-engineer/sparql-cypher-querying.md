# SPARQL and Cypher Querying

## Purpose
Write correct, maintainable graph queries that express domain intent clearly and scale to production workloads.

## When to use
Use when implementing graph retrieval, analytics, validation, debugging, or query review across RDF/SPARQL and property-graph/Cypher systems.

## Inputs
Graph schema, ontology, query requirement, sample data, engine version, latency target, and result contract.

## Preconditions
Understand identity rules, relationship direction, optional facts, and engine-specific semantics.

## Context to inspect
Existing query conventions, indexes, inference settings, cardinality, path patterns, pagination, and downstream consumers.

## Core knowledge
Graph queries are sensitive to traversal order, path expansion, optional matches, duplicate semantics, and aggregation. SPARQL operates over graph patterns and open-world data; Cypher uses pattern matching over property graphs. Equivalent-looking queries may differ in duplicate and null behavior.

## Procedure
1. Translate the business question into explicit graph patterns.
2. Identify selective starting points.
3. Bound variable-length traversals whenever possible.
4. Handle optional facts explicitly.
5. Define duplicate semantics before adding DISTINCT.
6. Filter as early as semantics permit.
7. Parameterize external input.
8. Separate retrieval from expensive aggregation when beneficial.
9. Inspect execution plans.
10. Test empty, duplicate, high-degree, and partial-data cases.
11. Confirm ordering and pagination stability.
12. Document non-obvious inference or path assumptions.

## Decision points
Use path queries when topology is the point; use precomputed relationships when repeated traversal cost is too high. Prefer subqueries when they reduce cardinality or improve readability, not merely stylistic preference.

## Common failure patterns
Unbounded paths; accidental Cartesian products; DISTINCT masking modeling defects; optional matches becoming mandatory through later filters; string-built queries; and unstable pagination.

## Verification
Compare expected results on curated fixtures, inspect plans, measure p95 latency on realistic cardinality, and verify query parameters prevent injection.

## Expected output
A parameterized query, execution-plan evidence, correctness tests, and documented assumptions.

## Stop conditions
Stop when required semantics are not represented in the graph or performance cannot meet targets without schema/index changes.