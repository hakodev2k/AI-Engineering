# Knowledge Graph Testing

## Purpose
Build a layered test strategy that protects graph semantics, ingestion, queries, inference, migrations, and AI retrieval from regression.

## When to use
Use when adding graph features, changing ontology/schema, modifying ingestion or extraction, optimizing queries, or releasing graph-backed AI workflows.

## Inputs
Graph model, constraints, queries, ingestion rules, inference rules, representative fixtures, production failure history, acceptance criteria.

## Preconditions
Tests can run against isolated graph instances or deterministic fixtures.

## Context to inspect
Unit tests, integration environments, SHACL/constraints, query suites, migration tests, graph-RAG evaluations, seed data, CI pipelines.

## Core knowledge
Graph correctness is relational: validating individual properties is insufficient. Tests should cover topology, identity, paths, negative relationships, inference, temporal behavior, authorization, and representative scale.

## Procedure
1. Define invariants at ontology and graph-model level.
2. Create minimal fixtures for each relationship pattern.
3. Add ingestion idempotency and reconciliation tests.
4. Test entity-resolution positive and negative cases.
5. Validate constraints and SHACL shapes.
6. Add query contract tests for expected result sets.
7. Test inferred facts and invalidation.
8. Add temporal, provenance, and authorization scenarios.
9. Run migration forward/rollback tests.
10. Add graph-RAG evaluation for grounded downstream behavior.
11. Maintain regression fixtures from production incidents.

## Decision points
Use small deterministic graphs for semantic tests and larger generated graphs for performance/topology tests. Avoid mocking the graph engine where query semantics are the behavior under test.

## Common failure patterns
Testing only happy paths, tiny graphs with no supernodes, no negative identity tests, snapshots that hide semantic errors, and ignoring migration compatibility.

## Verification
CI reliably catches deliberate violations, query results match fixtures, migrations are reversible where required, and performance tests exercise realistic topology.

## Expected output
A layered graph test suite, fixtures, acceptance thresholds, CI integration, and regression catalog.

## Stop conditions
Escalate when critical behavior cannot be reproduced in an isolated environment or production data is required without approved handling controls.