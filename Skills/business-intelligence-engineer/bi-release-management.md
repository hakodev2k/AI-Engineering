# BI Release Management

## Purpose
Release BI model, metric, pipeline, and report changes safely with dependency awareness, validation, rollback, and consumer communication.

## When to use
Use for production deployments, semantic breaking changes, migrations, and coordinated multi-layer releases.

## Inputs
Change set, lineage, tests, environments, deployment tooling, compatibility requirements, rollback options, owners.

## Context to inspect
Inspect dependencies, active usage, refresh schedules, environment differences, credentials, release history, and concurrent changes.

## Core knowledge
BI releases often span data and presentation layers with asynchronous refresh. A deployment can succeed technically while exposing mismatched model/report versions or partially refreshed data.

## Procedure
1. Classify change as backward-compatible, behavioral, or breaking.
2. Use lineage to identify downstream consumers.
3. Define deployment order across schema, transformations, semantic model, and reports.
4. Validate migration/backfill requirements and runtime.
5. Run automated correctness, security, and performance checks in a production-like environment.
6. Define rollback or forward-fix path for each layer.
7. Schedule around critical refresh/reporting windows when needed.
8. Deploy with versioned artifacts and auditable change records.
9. Run post-deploy smoke and reconciliation checks after refresh.
10. Monitor adoption/errors and retire deprecated contracts only after consumers migrate.

## Decision points
Use additive compatibility windows when many consumers depend on a contract. Coordinate atomic cutover when coexistence would produce inconsistent semantics.

## Common failure patterns
Report deployed before model, no post-refresh validation, changing metric meaning silently, environment drift, irreversible schema changes, and untracked manual edits.

## Verification
Confirm deployed versions, successful refresh, canonical values, RLS, critical interactions, and representative latency.

## Expected output
Controlled release with dependency plan, test evidence, rollback strategy, post-deploy verification, and communication.

## Stop conditions
Stop when rollback is impossible for a high-risk change, dependencies are unknown, critical tests fail, or a breaking semantic change lacks approval.