# Hook: Final Verification

## Trigger
After implementation/build/tests/schema checks and before the workflow may report `verified`.

## Preconditions
Evidence JSON exists and all project-specific verification outputs have been collected.

## Action
Run `python scripts/verify-migration-evidence.py <evidence.json>` and have the independent Migration Verifier inspect the final migration/application diff.

## Expected result
Exit code 0 and verifier confirmation that no unapproved blocking operation, missing compatibility proof, leaked secret, or unrelated change remains.

## Failure behavior
Any validation failure blocks completion. Preserve the evidence file and verifier output. Correct the underlying problem, then rerun; transient tool failures may be retried at most twice.

## Blocking
Yes. The workflow must not report success when this hook fails.
