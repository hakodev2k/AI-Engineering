# Hook: Pre-Execution Capability Gate

## Trigger
Immediately before the first MCP operation whose semantics depend on the negotiated session capability set.

## Preconditions
A current session snapshot and plan-requirements document exist.

## Action
Run `python scripts/check_capability_contract.py <session.json> <plan.json>`.

## Expected result
Exit 0 and JSON with `status: pass`.

## Failure behavior
Exit 2 blocks execution and returns missing capabilities to the bounded replan workflow. Exit 1 blocks execution because evidence is malformed or incomplete.

## Blocking
Yes.
