# SHACL Validation

## Purpose
Define enforceable graph-quality constraints with SHACL so invalid RDF data is detected before it contaminates reasoning, retrieval, or downstream AI systems.

## When to use
Use for ingestion gates, graph migrations, contract testing, semantic data quality, and pre-release validation of RDF datasets.

## Inputs
Ontology, business constraints, sample valid/invalid data, ingestion contracts, severity policy.

## Preconditions
Distinguish ontology semantics from operational validation requirements.

## Context to inspect
Existing shapes, namespaces, target classes/nodes, ingestion pipeline, validation engine, error handling, graph scale.

## Core knowledge
SHACL supports cardinality, datatype, pattern, class, node-kind, logical, property-path, and SPARQL-based constraints. Complex SPARQL constraints are powerful but harder to optimize and maintain.

## Procedure
1. Inventory critical invariants.
2. Map each invariant to SHACL Core where possible.
3. Define targets precisely.
4. Add meaningful severity and messages.
5. Create positive and negative fixtures.
6. Run shapes against representative graph sizes.
7. Optimize expensive property paths or SPARQL constraints.
8. Integrate validation into ingestion and CI.
9. Define quarantine versus reject behavior.
10. Version shapes with graph-schema changes.

## Decision points
Use SHACL Core before custom SPARQL. Reject violations that threaten identity, authorization, or semantic correctness; quarantine lower-confidence quality issues when business continuity matters.

## Common failure patterns
Overbroad targets, expensive global shapes, treating all violations equally, missing fixtures, and deploying ontology changes without updating shapes.

## Verification
Invalid fixtures fail for the intended reason, valid fixtures pass, runtime remains acceptable, and production reports are actionable.

## Expected output
Versioned SHACL shapes, test fixtures, validation policy, and integration guidance.

## Stop conditions
Escalate when a new constraint would reject large volumes of existing production data without an approved remediation plan.