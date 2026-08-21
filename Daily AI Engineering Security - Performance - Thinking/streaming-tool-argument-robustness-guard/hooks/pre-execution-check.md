# Hook: Pre-Execution Stream Finalization Check

## Trigger
Immediately before dispatching a tool whose arguments were received through a streaming provider path.

## Preconditions
The runtime has the tool call id/name, accumulated stream state, final-event status, byte/chunk counts, and policy.

## Action
Run:

`python3 scripts/stream_arg_guard.py validate <events.jsonl> --policy config/policy.json`

The hook validates stream completeness, event-mode consistency, configured budgets, final-authoritative reconciliation, and final JSON parseability.

## Expected result
Exit code `0` and JSON status `complete` with a normalized final argument object/hash.

## Failure behavior
- Exit `2`: invalid input/config; block dispatch.
- Exit `3`: truncated or missing final event; block dispatch and surface explicit failure.
- Exit `4`: configured budget exceeded; block dispatch.
- Exit `5`: final payload invalid/inconsistent; block dispatch.

The runtime MUST NOT silently fall back to partial preview arguments after a blocking result.

## Blocks completion
Yes. A side-effecting tool call cannot be considered safely implemented or verified if this hook fails.
