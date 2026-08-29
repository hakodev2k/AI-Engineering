# Code Review and Change Evidence Rules

## Purpose
Ensure graph changes receive review proportional to semantic and operational risk.

## Scope
Queries, model changes, migrations, configuration, ingestion, algorithms, drivers, and operational automation.

## MUST
- Explain affected graph semantics, access patterns, compatibility impact, and production risk in material changes.
- Include evidence appropriate to the change: tests, query plans, benchmarks, reconciliation, security validation, or migration dry-runs.
- Review destructive operations, public contract changes, privilege changes, and high-cost traversals with heightened scrutiny.
- Keep unrelated changes separate when separation improves review and rollback.

## MUST NOT
- Approve performance claims without measurements.
- Approve integrity claims based only on application happy-path tests.
- Hide generated queries, migration statements, or configuration effects from review when they affect production behavior.

## SHOULD
- Include representative before/after plans for query changes.
- Document alternatives and trade-offs for significant model changes.

## Exceptions
Emergency fixes may use expedited review but require explicit incident context, bounded scope, evidence available at the time, and follow-up review.

## Verification
Inspect change diff and evidence, CI results, approvals, query plans, migration output, security checks, and rollback notes. Confirm reviewer expertise matches the highest-risk aspect of the change.