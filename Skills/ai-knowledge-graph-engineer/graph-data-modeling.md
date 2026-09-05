# Graph Data Modeling

## Purpose
Translate domain semantics and access patterns into an efficient graph data model that supports traversal, analytics, AI retrieval, and maintainable evolution.

## When to use
Use when designing or refactoring property graphs or RDF graphs, introducing new workloads, or correcting graph structures that are difficult to query or govern.

## Inputs
Ontology, competency questions, expected traversals, cardinalities, data volumes, update patterns, latency targets, graph technology constraints.

## Preconditions
Understand both domain semantics and the query engine's storage/index behavior.

## Context to inspect
Labels/classes, edge predicates, indexes, uniqueness constraints, partitioning, query plans, graph size, hot subgraphs, application queries.

## Core knowledge
Good graph models optimize semantic clarity first and workload fit second. Modeling everything as nodes or everything as properties creates friction. High-degree nodes, supernodes, long paths, redundant edges, and mutable identity are recurring production risks.

## Procedure
1. List dominant read and write patterns.
2. Map domain entities and relationships to graph constructs.
3. Decide which values are nodes versus scalar properties.
4. Define edge direction and semantics consistently.
5. Model temporal and provenance dimensions explicitly where needed.
6. Add uniqueness and integrity constraints.
7. Identify possible supernodes and high-cardinality relationships.
8. Prototype representative traversals.
9. Inspect query plans and storage implications.
10. Document modeling conventions and migration strategy.

## Decision points
Promote a property to a node when it has identity, relationships, independent lifecycle, or shared semantics. Denormalize selectively when measured traversal cost justifies it.

## Common failure patterns
Schema-by-ingestion, ambiguous generic edges, duplicated inverse relationships without governance, supernodes, excessive denormalization, and model changes without migration planning.

## Verification
Representative traversals return correct results within latency targets, constraints prevent invalid states, and model semantics remain understandable without source-specific knowledge.

## Expected output
A graph model specification with node/edge definitions, constraints, index needs, workload rationale, and migration notes.

## Stop conditions
Escalate when workload requirements conflict fundamentally with the chosen graph technology or require destructive identity changes.