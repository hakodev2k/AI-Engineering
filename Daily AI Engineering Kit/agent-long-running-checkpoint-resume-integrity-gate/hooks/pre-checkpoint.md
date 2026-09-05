# Hook: Pre Checkpoint

## Trigger
Immediately before persisting a pause/handoff checkpoint.

## Preconditions
Task ID, scope, repository, current stage, and next action are known.

## Action
Capture HEAD/status/diff hash; normalize scope; validate approval expirations; record stage/next action; reject secret-bearing checkpoint content; write then re-read checkpoint.

## Expected result
Checkpoint evidence accurately reflects the last safe resumable boundary.

## Failure behavior
Transient read failure retries at most twice. Validation or missing metadata blocks checkpoint-dependent pause claims.

## Blocking
Yes.
