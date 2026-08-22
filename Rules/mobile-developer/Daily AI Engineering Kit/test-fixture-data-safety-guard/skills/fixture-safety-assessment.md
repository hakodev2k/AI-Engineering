# Fixture Safety Assessment

## Purpose
Determine whether test data and the target environment are safe before any automated test mutates state.

## When to use
Use before integration, API, Playwright, migration, seed, reset, or destructive test workflows.

## Inputs
- Target environment name and base URL/connection identifier
- Fixture source and generation method
- Planned write/delete/reset operations
- Isolation mechanism
- Cleanup/reset mechanism
- Known production-like indicators

## Preconditions
- Target environment is explicitly named.
- Fixture origin is identifiable.
- Planned side effects are known.

## Required context
Inspect repository test configuration, environment files, seed scripts, test setup/teardown, database reset utilities, API clients, and CI variables relevant to target selection.

## Allowed tools
Read-only repository search, config inspection, deterministic validators, test environment health checks, and non-mutating metadata queries.

## Constraints
- Do not infer that `staging`, `qa`, `dev`, or `test` is safe solely from its name.
- Do not copy production data into fixtures unless an approved sanitization process and evidence exist.
- Do not execute cleanup or reset commands during assessment.

## Process
1. Identify the exact target environment and backing services.
2. Classify environment as `ephemeral`, `dedicated-test`, `shared-nonprod`, `production-like`, `production`, or `unknown`.
3. Identify fixture provenance: `synthetic`, `generated`, `approved-sanitized-copy`, `shared-test-data`, `production-derived`, or `unknown`.
4. Enumerate mutations: inserts, updates, deletes, email/messages, external API calls, file writes, queue publications, cache changes.
5. Identify isolation boundary: tenant, database, schema, namespace, account prefix, transaction, container, or disposable environment.
6. Verify reset strategy and whether it is scoped to the isolation boundary.
7. Check for secrets, PII, real customer identifiers, live payment endpoints, real email/SMS targets, or production hostnames.
8. Create/update the safety manifest.
9. Run `scripts/validate-safety-manifest.py`.
10. Stop if status is `blocked` or `human-approval-required`.

## Expected output
A valid safety manifest with evidence for environment classification, fixture provenance, isolation, cleanup, and side effects.

## Verification
Assessment is complete only when deterministic validation passes and all required evidence fields are present.

## Failure handling
Missing or conflicting environment/fixture evidence becomes `unknown` and blocks execution. Retry metadata reads at most once for transient tool failures.

## Stop conditions
Stop before test execution when target is `production`, fixture provenance is `production-derived` without approved sanitization, isolation is missing, cleanup is unscoped, or any required evidence is unknown.