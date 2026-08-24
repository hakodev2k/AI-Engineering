# Hook: Pre-Complete Portability Verification

## Trigger

Immediately before an AI agent or CI workflow reports a repository-change task complete.

## Preconditions

All intended edits are present and the final build/test phase is ready to run or has run.

## Action

1. Run the case portability gate against the final working tree.
2. Confirm report status is `pass` and blocking findings equal zero.
3. Run repository-required build/tests after the final path repair.
4. Inspect `git diff --check` and `git status --short` when Git is available.
5. Hand the final report and test evidence to independent verification for high-risk or broad refactors.

## Expected result

Fresh passing scanner evidence tied to the final repository state plus normal task verification evidence.

## Failure behavior

Do not report completion. Return to diagnosis/repair with a maximum of 2 repair cycles, then escalate.

## Blocking

Yes.