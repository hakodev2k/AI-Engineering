# RDF, OWL, and SHACL

## Purpose
Use RDF semantics, OWL axioms, and SHACL constraints correctly to build interoperable semantic graphs without confusing inference with validation.

## When to use
Use for standards-based knowledge graphs, linked data, ontology reasoning, semantic interoperability, or machine-verifiable shape constraints.

## Inputs
Vocabulary, RDF datasets, ontology requirements, validation rules, reasoning requirements, and target triplestore capabilities.

## Preconditions
Confirm the graph requires RDF-family standards and identify supported entailment and SHACL profiles.

## Context to inspect
Namespaces, reused vocabularies, blank nodes, datatype usage, inference configuration, shapes, and existing validation failures.

## Core knowledge
RDF expresses triples; RDFS/OWL add semantic axioms; SHACL validates graph shapes. Open-world reasoning means absence is not necessarily false. OWL restrictions are not substitutes for closed-world validation.

## Procedure
1. Normalize namespaces and identifier conventions.
2. Separate ontology axioms from data validation rules.
3. Choose only the OWL expressivity needed.
4. Define SHACL node and property shapes for operational constraints.
5. Validate datatype, cardinality, class, and relationship constraints.
6. Test inference using explicit positive and negative examples.
7. Check reasoning cost and unintended entailments.
8. Run SHACL validation in ingestion and CI paths where appropriate.
9. Document entailment regime and closed-world assumptions.

## Decision points
Prefer SHACL for required fields and operational validation; use OWL when semantic inference is intentional. Avoid powerful constructs when simpler constraints are sufficient.

## Common failure patterns
Treating OWL as a database schema; assuming missing triples are false; inconsistent namespaces; blank-node identity mistakes; reasoning explosions; and duplicate constraints that disagree.

## Verification
Run reasoner consistency checks, SHACL validation, competency queries, and edge-case fixtures. Confirm inferred facts are intended and invalid data is rejected with actionable diagnostics.

## Expected output
Validated RDF/OWL/SHACL artifacts, documented reasoning assumptions, and test evidence.

## Stop conditions
Stop when required semantics exceed the engine's supported profile or authoritative vocabulary meaning is unclear.