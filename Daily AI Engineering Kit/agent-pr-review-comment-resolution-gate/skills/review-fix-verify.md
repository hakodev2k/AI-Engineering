# Skill: Review Fix and Verify

## Purpose
Implement accepted PR review changes and prove that each comment is resolved without introducing unrelated regressions.

## Inputs
- Triage decisions from `skills/review-comment-triage.md`.
- Current PR head SHA and changed-file set.
- Repository build/test commands.

## Preconditions
- Each editable comment is classified `needs-change`.
- Approval-required actions are absent or explicitly approved.

## Process
1. Reconfirm the current PR head SHA before editing.
2. Apply the smallest code change for one logical root cause.
3. Run format/static checks relevant to touched files.
4. Run the narrowest relevant tests, then broader project tests when the change crosses module boundaries.
5. If verification fails, preserve the failure output, update the hypothesis, and retry at most two times.
6. Inspect `git diff`/equivalent and compare changed files with the planned scope.
7. Map each review comment to changed files and verification evidence.
8. Mark a comment `resolved` only when the requested behavior is satisfied and verification passed.
9. Leave comments `blocked` when environment or permissions prevent proof.

## Expected output
A completed review-resolution record plus the modified repository files.

## Verification
- Relevant tests/build pass.
- No unintended files changed.
- Every resolved comment has implementation and verification evidence.
- Rejected comments retain repository evidence.

## Failure handling
After two failed fix/verify attempts for the same hypothesis, stop that comment, preserve evidence, and hand it to a human rather than looping.

## Stop conditions
Stop on approval boundaries, stale/conflicting branch state, unresolved build failures caused outside the change scope, or missing required credentials.
