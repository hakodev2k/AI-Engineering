# Ontology Design

## Purpose
Design a durable conceptual model that expresses domain meaning, constraints, and relationships without encoding accidental application structure. This skill turns ambiguous domain language into reusable semantic contracts.

## When to use
Use when creating or revising a knowledge graph, integrating heterogeneous sources, defining shared vocabulary, or resolving semantic ambiguity across teams. Avoid formal ontology work when a simple local schema is sufficient and no cross-domain interoperability is required.

## Inputs
Domain requirements, source schemas, business terminology, competency questions, existing taxonomies, sample data, integration contracts, and governance constraints.

## Preconditions
Identify domain experts, intended graph consumers, target graph technology, and the assurance level required for semantic consistency.

## Context to inspect
Existing vocabularies, identifiers, cardinalities, naming conventions, source-system semantics, regulatory terminology, downstream queries, and known modeling defects.

## Core knowledge
Senior ontology design separates concepts from records, defines identity explicitly, distinguishes classes from instances, models relations with direction and cardinality, and chooses normalization based on query and maintenance needs. Reuse established vocabularies when semantics truly match; do not import complexity merely for standards compliance.

## Procedure
1. Gather representative competency questions the graph must answer.
2. Identify core entities, events, concepts, relationships, and literals.
3. Normalize synonyms and detect overloaded terms.
4. Define stable identifiers and identity boundaries.
5. Decide which concepts need classes, controlled vocabularies, or simple attributes.
6. Define relation direction, domain, range, multiplicity, and optionality.
7. Encode constraints and invariants separately from descriptive semantics.
8. Validate the model against sample records and edge cases.
9. Review ambiguous concepts with domain experts.
10. Check interoperability with external vocabularies where relevant.
11. Evaluate likely query patterns and operational cost.
12. Document modeling decisions and rejected alternatives.
13. Version the ontology and define migration expectations.

## Decision points
Use a lightweight domain vocabulary when team-local semantics dominate. Use formal ontology constructs when inference, interoperability, or machine-verifiable semantics matter. Prefer explicit relations over overloaded text fields when the relationship is operationally important.

## Common failure patterns
Modeling database tables instead of domain meaning; unstable identifiers; excessive inheritance; ambiguous relation direction; encoding workflow state as ontology hierarchy; uncontrolled synonym growth; and importing external vocabularies without validating semantic equivalence.

## Verification
Confirm that competency questions can be represented and queried, constraints catch invalid examples, identifiers remain stable, domain experts accept definitions, and the model supports expected evolution without broad rewrites.

## Expected output
A versioned ontology or semantic model, definitions, relation semantics, constraints, identity rules, examples, and decision records.

## Stop conditions
Stop and escalate when core terminology is disputed, legal or regulatory semantics require authoritative interpretation, or competing identity models cannot be reconciled safely.