# Test Data Management

## Purpose
Create deterministic, isolated, privacy-safe test data that supports parallel automation and reliable cleanup.

## When to use
Use whenever tests create, mutate, share, seed, or depend on persisted data.

## Inputs
Data model, constraints, environment policy, privacy rules, test scenarios, parallelism model.

## Context to inspect
Uniqueness constraints, relationships, lifecycle, tenancy, clocks, external references, seed mechanisms, cleanup capabilities, and sensitive fields.

## Core knowledge
Tests should own the data they mutate. Prefer API/factory builders over brittle database snapshots. Generate unique identities, keep fixtures minimal, and never copy sensitive production data without approved anonymization.

## Procedure
1. Classify static reference data versus scenario-owned data.
2. Define builders/factories with safe defaults and explicit overrides.
3. Generate unique identifiers for parallel execution.
4. Seed through the lowest stable supported interface.
5. Record ownership for cleanup.
6. Make time-dependent data controllable where possible.
7. Prevent cross-tenant/test leakage.
8. Clean up deterministically or use disposable environments.
9. Mask/anonymize any approved production-derived datasets.
10. Monitor data growth and cleanup failures.

## Decision points
Use database seeding for speed only when coupling is acceptable; prefer public APIs when realistic validation matters. Disposable databases are ideal when infrastructure cost permits.

## Common failure patterns
Shared accounts, fixed IDs, order-dependent data, giant fixtures, production PII, cleanup only on success, tests mutating common reference records.

## Verification
Run suites concurrently and repeatedly; confirm no collisions, residual data, privacy violations, or hidden ordering dependencies.

## Expected output
Reusable data builders, isolation rules, cleanup strategy, and privacy controls.

## Stop conditions
Escalate when required data access violates environment or privacy policy.