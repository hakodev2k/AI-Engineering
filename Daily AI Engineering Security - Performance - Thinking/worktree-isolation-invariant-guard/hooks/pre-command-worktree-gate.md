# Hook: Pre-command Worktree Gate

## Trigger
Immediately before any repository mutation or path-sensitive command in a worktree-isolated agent.

## Preconditions
Trusted expected root is available. Intended write paths are known where applicable.

## Action
Run the read-only verifier with expected root, optional branch, and every intended write path.

## Command
`python3 scripts/verify_worktree.py --expected-root "$EXPECTED_WORKTREE" --expected-branch "$EXPECTED_BRANCH" --write-path path/to/output`

## Expected result
Exit 0 with `status=PASS`, observed Git top-level equal to expected root, registered worktree membership, branch match when configured, CWD and write paths inside the root.

## Failure behavior
Exit 2 means Git/configuration cannot be verified and blocks. Exit 3 means an invariant violation and blocks. Re-resolve trusted assignment once; repeated failure stops and escalates.

## Blocking
Yes. The hook cannot authorize destructive Git operations; any separate approval remains required.