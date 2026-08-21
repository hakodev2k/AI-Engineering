# Hook: Pre-Tool Idempotency Gate

## Trigger
Immediately before a side-effecting tool call, including retries and checkpoint resumes.

## Preconditions
`config/policy.json` exists and the caller can provide workflow ID, action, target, canonical arguments, effect class, and current ledger state.

## Action
Build a JSON request and execute:

`python scripts/idempotency_gate.py request.json --policy config/policy.json`

Persist any returned `claim` state before invoking the external tool.

## Expected result
Exit 0 with `execute` for a new safely claimed action, or `reuse` for a known success. Exit 3 means reconciliation is required; exit 4 blocks execution; exit 2 indicates invalid input.

## Failure behavior
For high-impact side effects, any nonzero result blocks execution. For low-impact writes, only an explicitly configured application policy may permit degraded behavior.

## Blocks completion
Yes when the action is high-impact, state is ambiguous, inputs are invalid, or the attempt budget is exhausted.
