# Hook — Pre Hook Execution
## Trigger
Immediately before any SessionStart, SessionEnd, TurnStart or TurnEnd hook runs.
## Preconditions
The host can supply hook identity/hash, authoritative cwd, approval origin and initiator.
## Action
Serialize the event and execute:
`python scripts/hook_trust_guard.py --event <event.json> --policy config/policy.json`
## Expected result
Exit 0 only when hash, cwd and approval provenance satisfy policy.
## Failure behavior
Exit 3 blocks the hook and records non-secret reason codes; exit 2 blocks for malformed input.
## Blocks completion
Yes for the hook action. The enclosing session may continue without that hook when product policy permits.
