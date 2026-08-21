# Testing Data Pipelines

## Purpose
Create a layered test strategy that protects transformation correctness, contracts, integration behavior, and replay safety.

## When to use
Use for new pipelines, refactoring, migrations, schema changes, incident regressions, and critical data products.

## Inputs
Transformation code, SQL, schemas, sample data, contracts, infrastructure dependencies, and business invariants.

## Context to inspect
Inspect failure history, edge cases, external systems, data volumes, nondeterministic logic, time handling, and existing CI capabilities.

## Core knowledge
Data tests must validate sets and invariants, not just code paths. Useful layers include pure transformation tests, SQL/model tests, contract tests, integration tests, quality assertions, and production reconciliation.

## Procedure
1. Identify high-risk business invariants.
2. Build minimal fixtures covering normal and boundary cases.
3. Unit-test deterministic transformation logic.
4. Test schema and producer/consumer contracts.
5. Exercise integrations with realistic engines when semantics matter.
6. Test duplicates, nulls, late data, deletes, and timezone boundaries.
7. Verify idempotent reruns and backfills.
8. Add regression fixtures for incidents.
9. Keep tests deterministic and isolated.
10. Reconcile representative end-to-end outputs.

## Decision points
Mock external systems for fast logic tests; use real compatible engines when optimizer, transaction, serialization, or storage semantics are part of the risk.

## Common failure patterns
Only testing happy-path rows, snapshots with no semantic assertions, production-sized fixtures in every test, mocking away database behavior, and no replay tests.

## Verification
Run tests from clean state, intentionally break key invariants to prove detection, and compare end-to-end results with trusted expected outputs.

## Expected output
A maintainable test suite mapped to business and technical risks with clear regression protection.

## Stop conditions
Escalate when authoritative expected behavior is unknown or required test data cannot be used safely under privacy rules.