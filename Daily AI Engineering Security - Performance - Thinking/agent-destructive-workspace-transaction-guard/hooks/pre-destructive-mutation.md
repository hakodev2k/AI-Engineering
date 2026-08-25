# Hook: Pre-Destructive Mutation

## Trigger
Before delete, overwrite, `git checkout -- <paths>`, reset/clean, or move that removes source.

## Preconditions
A plan JSON exists and no destructive command has run.

## Action
Run `python scripts/workspace_transaction_guard.py preflight --plan <plan.json>`.

## Expected result
Exit 0 and JSON `status: pass`.

## Failure behavior
Exit non-zero blocks the mutation. The caller records findings and may correct the plan/state once; maximum two total retries.

## Blocking
Yes. Failure MUST block completion and MUST NOT be bypassed by changing the success criteria.