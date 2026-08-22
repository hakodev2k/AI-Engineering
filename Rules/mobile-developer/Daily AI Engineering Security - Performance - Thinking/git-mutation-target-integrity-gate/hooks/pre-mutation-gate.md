# Hook: Pre-Mutation Gate

## Trigger
Immediately before a push, force push, remote branch deletion, worktree removal, archive cleanup, or repository-linked recursive deletion.

## Preconditions
Resolved facts have been written to a JSON input file; no side effect has started.

## Action
Run:

`python scripts/git_mutation_guard.py --input <facts.json>`

## Expected result
Exit `0` with `decision=ALLOW` and a concrete resolved target.

## Failure behavior
Exit `2` means policy BLOCK. Exit `1` means invalid/incomplete evidence. Both block completion and mutation.

## Blocking
Yes. The hook MUST block mutation unless it returns ALLOW. A human approval is represented as input evidence and must explicitly bind to the exact default branch and operation; approval cannot override filesystem root escape.

## Post-action companion check
Re-run read-only target reconstruction after the mutation and compare it with the recorded allowed target. Any mismatch blocks final completion.