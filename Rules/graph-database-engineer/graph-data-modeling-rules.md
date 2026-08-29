# Graph Data Modeling Rules

## Purpose
Ensure graph models encode stable domain semantics and support required traversals without accidental complexity.

## Scope
Property-graph and RDF-style models, including nodes/vertices, edges/relationships, labels/types, and properties.

## MUST
- Model relationships explicitly when their identity, direction, properties, or traversal semantics matter.
- Derive the model from documented access patterns, cardinalities, lifecycle, and ownership boundaries.
- Define identity, uniqueness, optionality, and direction semantics for every production entity and relationship type.
- Validate high-impact model changes against representative production-scale data and queries.

## MUST NOT
- Copy a relational schema mechanically into a graph model.
- Introduce relationship types whose semantics are ambiguous or overlap without a documented distinction.
- Encode security boundaries only as informal graph conventions.

## SHOULD
- Prefer domain terminology over storage-oriented names.
- Keep frequently traversed facts close to the entities they describe when consistency requirements permit.

## Exceptions
Exceptions require the access pattern, alternative considered, consistency impact, migration risk, and reviewer approval to be documented.

## Verification
Review schema/model documentation, constraints, representative query plans, cardinality samples, and migration tests. Confirm that required traversals remain understandable and bounded.