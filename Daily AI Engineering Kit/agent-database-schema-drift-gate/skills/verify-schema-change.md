# Skill: Verify Schema Change

## Purpose
Independently prove that the final database-related change matches declared intent and does not contain unapproved drift.

## Inputs
Acceptance criteria, final Git diff, baseline/candidate snapshots, drift report, migration/generated SQL, test/build output, approval evidence if required.

## Preconditions
Implementation is finished for the current iteration. Verification must use the final candidate state, not a pre-fix report.

## Process
1. Confirm baseline provenance and candidate commit/worktree identity.
2. Validate both snapshots against `schemas/schema-snapshot.schema.json` conceptually and via the script's structural validation.
3. Re-run `scripts/schema_drift.py`; do not trust a supplied report without reproduction.
4. Compare every finding to acceptance criteria.
5. Inspect generated migration/SQL for operations not represented by the intended change.
6. Confirm destructive findings have explicit approval tied to the exact final diff.
7. Run repository-specific persistence tests and build.
8. Inspect Git diff for unrelated migration, snapshot, seed, or configuration changes.
9. Confirm no secrets or production connection strings were added.
10. Run `python scripts/verify_package.py` when validating this kit itself.
11. Produce status `verified`, `blocked`, or `inconclusive` with evidence.

## Expected output
Verification status; reproduced report path; checks executed and exit codes; approval status; unresolved risks.

## Failure handling
Do not reinterpret failing checks as success. A test/build failure may be handed back for at most two fix/retest cycles. If final schema changes after approval, invalidate approval and verify again.

## Completion criteria
`verified` requires reproducible non-blocking policy result, relevant tests/build passing, no unintended diff, and all approval requirements satisfied.
