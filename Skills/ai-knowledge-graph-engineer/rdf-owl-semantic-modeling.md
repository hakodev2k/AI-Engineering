# RDF and OWL Semantic Modeling

## Purpose
Build interoperable semantic graphs using RDF, RDFS, and OWL while controlling inference complexity and ontology evolution.

## When to use
Use when standards-based semantics, linked data, formal reasoning, or cross-system interoperability are important.

## Inputs
Domain ontology, external vocabularies, reasoning requirements, competency questions, sample triples, performance constraints.

## Preconditions
Confirm that formal semantics provide real value beyond a simpler graph model.

## Context to inspect
Namespaces, existing vocabularies, class/property hierarchies, reasoner configuration, SHACL shapes, SPARQL queries, import dependencies.

## Core knowledge
Open-world semantics, monotonic reasoning, class expressions, property characteristics, equivalence, disjointness, and imports can produce unintuitive results. More expressive OWL profiles increase reasoning cost and operational complexity.

## Procedure
1. Define namespaces and naming conventions.
2. Reuse stable external vocabularies selectively.
3. Model classes and object/datatype properties.
4. Add domain/range only when semantically valid.
5. Define equivalence, disjointness, cardinality, and property characteristics carefully.
6. Select an OWL profile compatible with reasoning needs.
7. Add SHACL for operational data validation.
8. Test expected and unexpected inferences.
9. Benchmark reasoning on realistic graph sizes.
10. Version ontology IRIs and imports deliberately.

## Decision points
Use OWL inference for durable semantic truth; use SHACL for closed-world validation. Avoid expressive constructs when query-time materialization or reasoning cost becomes unacceptable.

## Common failure patterns
Treating domain/range as validation, accidental inference explosions, circular imports, uncontrolled owl:sameAs, and mixing business validation with ontology semantics.

## Verification
Run consistency checks, inference tests, SHACL validation, and representative SPARQL queries against known examples.

## Expected output
A versioned semantic model, reasoning profile, validation shapes, inference tests, and interoperability notes.

## Stop conditions
Stop when required semantics create unacceptable reasoning cost or external vocabulary conflicts cannot be reconciled safely.