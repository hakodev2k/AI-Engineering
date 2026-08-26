# Hook: Post-Turn Convergence Gate

## Trigger
After each autonomous model/tool cycle and before the next automatic continuation.

## Preconditions
Current acceptance count, artifact fingerprint, evidence count, new-work count and finalization intent are available without exposing secrets.

## Action
Append one sanitized ledger row and run:
`python scripts/convergence_guard.py --ledger <task-ledger.jsonl> --policy config/policy.json`

## Expected result
Exit 0 permits the next bounded action. Exit 3 blocks automatic continuation and requires recovery or escalation.

## Failure behavior
Persist the current checkpoint, identify the blocking violation and stop the continuation loop. Never convert a block into another generic "continue" turn.

## Blocking
Yes.
