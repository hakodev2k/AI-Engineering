# Graph Testing Strategy

## Purpose
Build a layered test strategy that proves graph semantics, ingestion, constraints, queries, inference, migrations, and integrations remain correct as the system evolves.

## When to use
Use when introducing graph capabilities, changing schemas or mappings, adding critical queries, or raising production assurance.

## Inputs
Requirements, graph model, ingestion code, queries, inference rules, migrations, downstream contracts, known defects, and risk profile.

## Preconditions
Define critical invariants and obtain representative data patterns including high-degree, duplicate, partial, and conflicting cases.

## Context to inspect
Existing unit/integration tests, graph fixtures, test containers, CI runtime, production incidents, query contracts, and validation tooling.

## Core knowledge
Graph tests must validate topology and semantics, not only row-like properties. Small canonical fixtures are useful for deterministic reasoning; generated graphs expose combinatorial and degree-related defects. Integration tests are essential for engine-specific query and transaction behavior.

## Procedure
1. Map critical requirements to test layers.
2. Unit-test normalization, mapping, and identity functions.
3. Create canonical graph fixtures with explicit expected topology.
4. Test schema and semantic constraints.
5. Run ingestion idempotency and replay tests.
6. Test queries for empty, partial, duplicate, cyclic, and high-degree graphs.
7. Test inference or SHACL rules where used.
8. Add authorization boundary tests.
9. Test migrations forward and rollback where supported.
10. Add property-based or generated-graph tests for invariants.
11. Reproduce production defects as regression tests.
12. Keep CI tests deterministic and isolate expensive scale tests.
13. Report implemented behavior separately from verified evidence.

## Decision points
Use mocks only for external boundaries; use a real graph engine for query semantics and transactions. Prefer minimal deterministic fixtures for correctness and larger generated datasets for performance/topology risk.

## Common failure patterns
Testing only happy paths; fixtures with no cycles or duplicates; mocking graph queries; no migration tests; shared mutable test databases; and assertions on counts without topology semantics.

## Verification
Run the suite from a clean environment, confirm deterministic results, deliberately break known invariants to ensure tests fail, and review coverage against the risk map.

## Expected output
A layered graph test suite, fixtures, risk-to-test traceability, CI strategy, and regression evidence.

## Stop conditions
Stop when critical semantics cannot be represented in test fixtures or required integration environments are unavailable and would make verification claims unreliable.