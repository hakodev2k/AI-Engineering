# Warehouse Testing Strategy

## Purpose
Define layered tests that prove warehouse transformations are structurally valid, semantically correct, and safe to release.

## When to use
Use when introducing models, changing transformation logic, migrating platforms, or strengthening regression protection.

## Inputs
Transformation code, source contracts, business rules, target schemas, historical incidents, acceptance criteria.

## Context to inspect
Existing tests, deployment pipeline, data quality tooling, model dependencies, trusted reconciliations, and known failure modes.

## Core knowledge
Warehouse tests should cover schema, keys, relationships, accepted values, temporal rules, business invariants, reconciliation, and representative end-to-end outcomes. Passing SQL compilation is not semantic verification.

## Procedure
1. Classify model criticality and failure impact.
2. Add schema and type assertions.
3. Test uniqueness and non-null constraints where semantically required.
4. Test referential integrity and relationship cardinality.
5. Encode business invariants and temporal rules.
6. Add reconciliation for critical measures.
7. Build fixtures for edge cases and late/corrected data.
8. Add regression tests for prior incidents.
9. Gate deployment on appropriate test severity.
10. Track flaky or noisy tests as defects.

## Decision points
Use fast deterministic tests in every CI run; reserve expensive full reconciliations for targeted or scheduled execution. Prefer invariant tests over brittle exact snapshots when data legitimately changes.

## Common failure patterns
Testing only row counts, excessive null checks without business meaning, unstable snapshots, ignored warnings, and tests that run after consumers already see bad data.

## Verification
Demonstrate that seeded defects fail the intended tests and that successful runs produce auditable evidence.

## Expected output
A risk-based warehouse test suite integrated into delivery workflows.

## Stop conditions
Stop release when critical invariants or reconciliations fail without an approved explanation.