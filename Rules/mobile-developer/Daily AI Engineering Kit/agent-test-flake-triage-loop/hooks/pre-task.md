# Hook: Pre-task Validation

## Trigger
Before flaky-test investigation starts.

## Preconditions
Repository root is known and target test command is supplied.

## Action
1. Run `git status --short` and record whether the tree was already dirty.
2. Confirm `scripts/run-flake-loop.sh` and `scripts/inspect-test-history.py` are available.
3. Create `.ai/flake-triage/evidence` without deleting existing evidence.
4. Record current commit with `git rev-parse HEAD` when Git is available.
5. Reject commands that obviously target production deployment, destructive database operations, or Git history rewriting.

## Expected result
A preserved baseline describing repository state and a safe reproduction command.

## Failure behavior
Missing repository/test prerequisites block execution. A pre-existing dirty tree does not automatically block, but must be recorded so later diff inspection can distinguish prior changes.

## Blocking
Yes for missing target command, inaccessible repository, or dangerous command; otherwise no.