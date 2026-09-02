# Property Graph Modeling

## Purpose
Design labeled property graphs that balance domain clarity, traversal efficiency, indexing, and maintainable mutation patterns.

## When to use
Use with Neo4j-like or other property-graph systems when defining labels, relationship types, properties, constraints, or refactoring inefficient graph structures.

## Inputs
Domain model, query workload, graph engine, data volumes, write rates, latency targets, and consistency requirements.

## Preconditions
Obtain representative read and write queries and understand the engine's indexing and constraint semantics.

## Context to inspect
Labels, relationship types, indexes, uniqueness constraints, high-degree nodes, duplicated properties, and hot traversal paths.

## Core knowledge
Labels should represent useful classification, relationship types should carry domain meaning, and properties should live where their ownership is clear. High-degree supernodes and generic edges often create performance and maintenance problems.

## Procedure
1. Map domain entities to candidate nodes.
2. Define relationship types and direction from business semantics.
3. Place properties according to ownership and lifecycle.
4. Add uniqueness and existence constraints where supported.
5. Identify high-degree nodes and unbounded traversals.
6. Design indexes around selective entry points, not every property.
7. Prototype common traversals and mutations.
8. Inspect execution plans and cardinality estimates.
9. Test deletion and relationship lifecycle behavior.
10. Document denormalization and synchronization obligations.

## Decision points
Use relationship properties for attributes intrinsic to the relation. Promote a relation to a node when it has its own identity, lifecycle, or many attached facts. Split labels only when semantics or query selectivity justify it.

## Common failure patterns
Generic `RELATED_TO` edges; excessive labels; supernodes; storing arrays of identifiers instead of edges; indexing low-selectivity properties; and duplicating mutable facts without ownership.

## Verification
Run representative query plans, constraint tests, high-degree cases, mutation tests, and realistic performance checks.

## Expected output
A property-graph schema, constraints, index plan, query examples, and documented trade-offs.

## Stop conditions
Stop if workload data is unavailable or schema changes require destructive migration without an approved rollback strategy.