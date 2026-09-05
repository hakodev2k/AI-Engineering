# Domain Ontology Design

## Purpose
Design a durable ontology for AI and knowledge-graph systems so entities, relationships, constraints, and semantics remain understandable across ingestion, retrieval, reasoning, and application layers.

## When to use
Use when creating or restructuring a knowledge graph, introducing new domains, aligning multiple source systems, or defining semantics for graph-powered AI. Do not use a heavyweight ontology when a simple labeled graph or relational schema is sufficient.

## Inputs
Domain requirements, source schemas, business vocabulary, competency questions, sample data, existing taxonomies, application queries, governance constraints.

## Preconditions
Identify authoritative domain experts and existing semantic standards before inventing new concepts.

## Context to inspect
Current graph schema, namespaces, identifiers, source-system semantics, downstream APIs, SPARQL/Cypher queries, embeddings, RAG workflows, validation rules.

## Core knowledge
A Senior engineer distinguishes conceptual semantics from storage representation. Classes, instances, properties, cardinality, inheritance, controlled vocabularies, provenance, and identity rules must be explicit. Ontology choices create long-term coupling and migration cost.

## Procedure
1. Gather competency questions the graph must answer.
2. Extract stable domain concepts and relationships.
3. Reuse established vocabularies where they fit.
4. Define identifiers and identity boundaries.
5. Model classes, properties, constraints, and cardinalities.
6. Separate core ontology from source-specific extensions.
7. Define provenance and temporal semantics.
8. Review ambiguous concepts with domain experts.
9. Test the model against representative queries and edge cases.
10. Version and document semantic decisions.

## Decision points
Use inheritance only for true substitutability. Prefer explicit relations over overloaded generic edges. Choose RDF/OWL semantics when interoperability and inference matter; choose property-graph modeling when operational traversal and application ergonomics dominate.

## Common failure patterns
Mirroring source tables directly, unstable identifiers, overusing inheritance, encoding business rules only in prose, duplicating synonymous concepts, and creating an ontology too abstract for actual queries.

## Verification
Verify competency questions can be represented and answered, constraints reject invalid examples, identifiers remain stable, and domain experts approve terminology.

## Expected output
A versioned ontology/schema with concept definitions, relationships, identity rules, constraints, examples, and migration notes.

## Stop conditions
Stop and escalate when critical domain semantics conflict across authoritative sources or when changes would break contractual external identifiers.