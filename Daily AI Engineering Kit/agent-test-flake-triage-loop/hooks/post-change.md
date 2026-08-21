# Hook: Post-change Verification

## Trigger
After a proposed flaky-test fix is implemented.

## Preconditions
The changed files are known and original failure evidence exists.

## Action
1. Inspect `git diff --check` and `git diff`.
2. Reject obvious masking patterns: disabled/skipped test, assertion removal, arbitrary sleep, or retry-only fix unless explicitly approved and justified.
3. Run the target test with `scripts/run-flake-loop.sh --attempts <post_fix_attempts>`.
4. Summarize evidence using `scripts/inspect-test-history.py`.
5. Run the nearest relevant suite once.
6. Hand evidence and diff to `subagents/verification-agent.md`.

## Expected result
Independent verification evidence with zero repeated target failures and a passing nearby suite.

## Failure behavior
Any target failure, suite failure, prohibited masking behavior, or inability to inspect the diff blocks completion and returns control to the workflow for bounded re-planning.

## Blocking
Yes.