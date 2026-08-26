# Hook: Pre Completion Verification Freshness

## Trigger
Immediately before an agent claims a coding task is verified or complete.

## Preconditions
A verification record and current workspace snapshot are available.

## Action
Build a state JSON containing verification epoch, previous epoch, exit code, verified snapshot, current snapshot, verified timestamp, and dirty/diff-capture state. Run:

`python scripts/verification_epoch_guard.py --state <state.json> --policy config/policy.json`

## Expected result
Exit 0 with `decision=fresh` permits a verification-backed completion claim.

## Failure behavior
Exit 3 blocks the verified claim and returns exact invalidators. Exit 2 blocks because evidence could not be evaluated.

## Blocks completion
Yes, when the completion claim depends on verification freshness.
