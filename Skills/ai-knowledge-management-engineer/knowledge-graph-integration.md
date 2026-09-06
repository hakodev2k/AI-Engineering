# Knowledge Graph Integration

## Purpose
Integrate graph-structured knowledge with document retrieval so AI systems can exploit explicit entities, relationships, hierarchy, and constraints without replacing authoritative source text.

## When to use
Use when user questions depend on multi-hop relationships, entity identity, ownership, lineage, dependency, organizational structure, or domain ontologies that plain chunk retrieval handles poorly.

## Inputs
Entity model, relationship types, source mappings, graph store, document corpus, identifiers, retrieval use cases, and evaluation queries.

## Context to inspect
Inspect existing schemas, entity IDs, aliases, relationship provenance, cardinalities, graph freshness, document links, and known ambiguous or conflicting relationships.

## Core knowledge
Graphs excel at explicit relationships and constrained traversal; vector retrieval excels at semantic similarity. Graph facts require provenance and temporal semantics just as documents do. Automatically extracted edges should not be treated as authoritative without confidence and source lineage.

## Procedure
1. Identify high-value questions that require explicit relationships or multi-hop traversal.
2. Define canonical entity types, stable IDs, and relationship semantics.
3. Map source fields and documents to graph entities while preserving provenance.
4. Separate authoritative edges from inferred or extracted edges.
5. Model effective dates, confidence, and ownership where relationships change over time.
6. Resolve aliases and duplicate entities conservatively.
7. Decide how graph traversal and document retrieval cooperate for each query type.
8. Bound traversal depth and fan-out to control latency and irrelevant context.
9. Return graph-derived evidence with links to supporting sources.
10. Evaluate graph-only, document-only, and combined retrieval on representative questions.

## Decision points
Use graph traversal when relationships are explicit and bounded; use semantic retrieval for descriptive or loosely phrased evidence. Materialize relationships only when their maintenance value exceeds inference cost.

## Common failure patterns
Treating extracted triples as truth, creating unstable entity IDs, unbounded graph traversal, losing source provenance, and duplicating facts inconsistently between graph and documents.

## Verification
Test entity resolution, multi-hop queries, stale relationship updates, provenance links, and combined retrieval quality. Validate graph answers against authoritative source records.

## Expected output
A graph integration design with entity schema, relationship provenance, retrieval orchestration, freshness rules, and evaluation evidence.

## Stop conditions
Stop when entity identity is unresolved in a high-impact domain, relationship extraction lacks reliable provenance, or graph synchronization cannot meet required freshness guarantees.