# Quality Review and Change Management

## Purpose
Review data changes for quality risk and ensure controls evolve deliberately with code, schemas, semantics, and consumer expectations.

## When to use
Use during pull requests, design reviews, schema changes, pipeline releases, rule modifications, and deprecations.

## Inputs
Change diff, requirements, lineage, contracts, tests, migration plan, quality metrics, and rollback strategy.

## Preconditions
The reviewer needs enough context to understand intended behavior and affected consumers.

## Context to inspect
Inspect transformation logic, joins, filters, keys, null handling, time semantics, schema changes, backfills, test changes, monitoring, and deployment order.

## Core knowledge
Data defects often arise from semantically plausible code. Senior review focuses on grain, invariants, compatibility, operational recovery, and downstream impact rather than style alone.

## Procedure
1. Restate intended semantic change.
2. Identify affected data grain and contracts.
3. Trace downstream impact.
4. Review joins for cardinality changes and row multiplication.
5. Review filters, null handling, units, and time boundaries.
6. Check schema compatibility and migration ordering.
7. Examine tests for edge cases and escaped incidents.
8. Assess backfill requirements and idempotency.
9. Confirm observability and rollback/recovery.
10. Require evidence for risky assumptions.
11. Record unresolved risks and owners before approval.

## Decision points
Request additional tests when semantics are high-risk, not merely because coverage is low. Require staged rollout or shadow comparison when blast radius is large. Block changes with unbounded or unknown downstream impact.

## Common failure patterns
Reviewing SQL syntax but not grain; approving silent semantic changes; no backfill plan; tests updated to match wrong output; monitoring added after release; rubber-stamping generated transformations.

## Verification
The change passes tests, compatibility checks, representative reconciliation, and deployment validation; identified risks have explicit disposition.

## Expected output
A quality-focused review decision with evidence, required controls, migration notes, and residual risks.

## Stop conditions
Do not approve when critical semantics, affected consumers, destructive migration behavior, or recovery strategy remain unknown.