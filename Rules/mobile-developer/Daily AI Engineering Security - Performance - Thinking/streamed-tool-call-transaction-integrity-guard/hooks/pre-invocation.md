# Hook: Pre-Invocation Transaction Gate

## Trigger
Immediately before any streamed function/tool invocation.

## Preconditions
Raw argument buffer, terminal-event status, call ID, tool name, schema emptiness declaration, and execution state are available.

## Action
Write the transaction envelope to JSON and run:

`python scripts/transaction_guard.py transaction.json --policy config/policy.json`

## Expected result
Exit 0 only for `ready` or a safe bounded `retry` decision. `ready` includes parsed arguments and evidence hash. `reconcile`/`block` prevent invocation.

## Failure behavior
Parser failure, incomplete stream, identity conflict, or unknown write state is preserved as evidence and propagated as an explicit orchestration failure fact.

## Blocking
Yes. Hook failure MUST block the affected invocation and any completion criterion that depends on it.