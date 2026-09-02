# Graph Data Modeling

## Purpose
Design graph structures that support correct traversal, maintainable semantics, and predictable performance across real workloads.

## When to use
Use when translating domain concepts into nodes, edges, properties, reified relationships, hyperedge-like structures, or graph partitions. Use during greenfield design, schema refactoring, or when current models create awkward queries or integrity problems.

## Inputs
Ontology or domain model, representative queries, write patterns, data volumes, update frequency, graph engine capabilities, latency targets, and consistency requirements.

## Preconditions
Know whether the target is an RDF graph, property graph, or another graph model. Obtain realistic examples rather than modeling from abstract diagrams alone.

## Context to inspect
Current schema, indexes, constraints, label/type conventions, relationship direction, duplicated facts, source ownership, hot traversals, and mutation patterns.

## Core knowledge
Graph modeling optimizes semantic clarity and traversal shape together. Nodes should represent independently identifiable things; edges should represent meaningful relationships. Reification is justified when a relationship has identity, attributes, provenance, or temporal behavior. Denormalization can improve reads but creates synchronization obligations.

## Procedure
1. Define the business questions and critical traversal paths.
2. Identify independently addressable entities and relationship facts.
3. Establish identifier strategy before loading data.
4. Choose node/edge or subject-predicate-object representations deliberately.
5. Model relationship attributes explicitly when needed.
6. Decide where duplication improves locality and where it creates unacceptable drift.
7. Define cardinality and uniqueness constraints.
8. Model lifecycle, deletion, archival, and temporal behavior.
9. Validate the structure against write-heavy and read-heavy scenarios.
10. Prototype representative queries.
11. Measure traversal depth, fan-out, index use, and result size.
12. Review maintainability and migration impact.
13. Document trade-offs and invariants.

## Decision points
Create an intermediate node when a relationship has meaningful identity, many attributes, multiple participants, or its own lifecycle. Keep an edge when the relation is simple and query locality matters. Denormalize only with an explicit synchronization strategy.

## Common failure patterns
Table-shaped graphs; generic relationship types; unbounded fan-out; inconsistent edge direction; excessive reification; duplicated truth with no owner; and modeling for one query while breaking common updates.

## Verification
Run representative queries and writes on realistic data. Confirm constraints, identifier stability, explain plans, traversal boundedness, and that common mutations do not require fragile multi-location updates.

## Expected output
A graph schema with node/edge definitions, constraints, identity rules, modeling rationale, and validated query examples.

## Stop conditions
Stop when workload characteristics are unknown, the target engine cannot enforce required constraints, or the proposed model would require destructive migration without an approved plan.