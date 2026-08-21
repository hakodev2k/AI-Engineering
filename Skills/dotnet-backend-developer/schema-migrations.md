# Database Schema Migrations

## Purpose
Evolve production schemas safely with compatibility, rollback/roll-forward, locking, and large-data behavior considered explicitly.

## When to use
Adding/changing columns, indexes, constraints, tables, relationships, or data backfills.

## Inputs
Current schema, desired model, data volume, deployment strategy, compatibility window, DB capabilities.

## Context to inspect
Generated migration SQL, table size, lock behavior, application versions, nullable/default semantics, index build options, backfill plan.

## Core knowledge
Application and schema may coexist across deployments; expand-and-contract minimizes compatibility risk; large rewrites/index builds can lock or saturate production.

## Procedure
1. Classify change as additive, destructive, or data-transforming.
2. Prefer additive compatible schema first.
3. Deploy code that handles old/new states when needed.
4. Backfill in bounded batches with observability.
5. Add constraints only after data satisfies them.
6. Remove old columns/contracts in a later deployment.
7. Review generated SQL manually.
8. Estimate runtime/locking on production-like volume.
9. Define recovery/roll-forward strategy.

## Decision points
Use online/concurrent index options when supported and justified. Avoid single-transaction massive backfills when they create unacceptable locks/log growth.

## Common failure patterns
Rename/drop in one step, non-null column with expensive default on huge table, unbounded backfill, assuming ORM migration is operationally safe.

## Verification
Migration test on representative data, compatibility smoke tests, lock/runtime observation, post-migration data validation.

## Expected output
A staged, observable schema evolution plan.

## Stop conditions
Escalate destructive or long-running production migrations requiring DBA/change approval.