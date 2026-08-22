# Hook: Final Verification

## Trigger
After implementation and relevant tests, before declaring the job concurrency-safe.

## Preconditions
Changed files and test output are available. Required approvals, if any, are recorded.

## Action
1. Run relevant project build/tests.
2. Re-run `python scripts/scan-job-overlap.py --root <repo-root> --output overlap-findings-final.json`.
3. Run `python scripts/verify-package.py --package-root <kit-root>` when validating this kit itself.
4. Inspect the final diff for scheduler interval, retry, timeout, lock scope, idempotency, schema, production config, and unrelated changes.
5. Have `subagents/concurrency-verifier.md` perform independent verification.

## Expected result
Evidence shows the intended overlap policy under concurrent start and retry/failure conditions; all approval boundaries remain intact.

## Failure behavior
Any unexplained failing concurrent test, unsafe lock ownership behavior, missing approval, or unknown side-effect duplication risk blocks `verified-safe`. Maximum two correction cycles.

## Blocking
Yes.
