# Skill: Investigate Migration Risk

## Purpose
Determine whether a proposed database change can be deployed safely without breaking old or new application versions, locking critical tables, losing data, or requiring an unapproved destructive action.

## When to use
Use before adding, altering, renaming, backfilling, or removing schema elements, and when reviewing ORM-generated migrations.

## Inputs
- Migration files or proposed SQL.
- Current schema and target schema.
- Application versions that may coexist during rollout.
- Table size/traffic information when available.
- Existing migration conventions and tests.

## Preconditions
Repository and migration paths are identified. Production credentials are not required and must not be requested for static analysis.

## Allowed tools
Read-only repository search, diff inspection, local build/test tools, database explain/schema tools against approved non-production environments, and `scripts/scan-migration-risk.py`.

## Constraints
Do not execute production migrations, destructive SQL, or mutate production configuration. Treat generated migrations as code requiring review.

## Procedure
1. Locate migration entry points, ORM configuration, schema snapshots, migration tests, and deployment ordering.
2. Run `python scripts/scan-migration-risk.py <migration-files>` and retain the JSON output as evidence.
3. Classify each operation as additive, transitional, destructive, data-transforming, or operationally expensive.
4. Identify which application versions read/write affected columns or tables.
5. Check whether old and new application versions can coexist after the expand step and before the contract step.
6. For backfills, identify batching, idempotency, resume behavior, write amplification, and verification queries.
7. For constraints or type changes, determine whether existing rows satisfy the target invariant before enforcement.
8. Mark every policy-listed operation as approval-required; never reinterpret it as safe merely because tooling generated it.
9. Produce facts, hypotheses, decisions, evidence, open questions, and blocking risks separately.

## Expected output
A migration evidence draft matching `schemas/migration-evidence.schema.json`, plus a list of blocking risks and required approvals.

## Verification
Every affected schema object is accounted for; application compatibility is evidenced; scanner output is attached or summarized; approval-required actions are explicit.

## Failure handling
If schema state, application compatibility, or backfill behavior cannot be established, set status to `blocked`. Retry transient tool failures at most twice while preserving prior output.

## Stop conditions
Stop before production execution, irreversible transforms, destructive SQL, or any policy-listed operation until explicit human approval exists.
