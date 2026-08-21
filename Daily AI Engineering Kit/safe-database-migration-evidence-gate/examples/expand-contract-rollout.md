# Example: Expand-Contract Rollout

This example shows how to change a required column without forcing an unsafe single-step migration.

## Scenario
Existing application uses `customers.full_name`. New design wants `customers.display_name` and eventually removes `full_name`.

## Unsafe single-step approach
Rename/drop `full_name` and deploy the new application at the same time. This creates a compatibility cliff during rolling deployment and makes rollback difficult.

## Expand phase
1. Add nullable `display_name` without removing `full_name`.
2. Deploy application version that can read both fields and writes both fields.
3. Verify old application instances still operate correctly against the expanded schema.
4. Backfill `display_name` in bounded, idempotent batches.
5. Reconcile counts and semantic invariants.
6. Switch reads to `display_name` after backfill verification.

## Contract phase
1. Confirm no supported application version reads/writes `full_name`.
2. Observe for the agreed compatibility window.
3. Create a separate migration to remove `full_name`.
4. Classify the removal as destructive and require human approval.
5. Preserve recovery evidence/backups according to project policy.
6. Apply and verify through the standard migration workflow.

## Evidence to capture
- Generated SQL for both phases.
- Application code paths proving dual-read/dual-write behavior where applicable.
- Backfill batch size and resume/idempotency rule.
- Source/target row counts and null/quality checks.
- Staging migration duration.
- Compatibility test for old app + expanded schema and new app + expanded schema.
- Reviewer report and approval for destructive contract phase.

## Stop conditions
Do not enter the contract phase while any supported application version still depends on `full_name`, while reconciliation is incomplete, or while rollback/forward-fix evidence is missing.