# Hook — Ephemeral Session Resource Intent
## Trigger
Before an internal or user-visible ephemeral session is admitted, and again when its one-shot work completes.
## Preconditions
The host knows feature name, ephemeral flag, whether tools are required, effective MCP count, pending tool calls and intended completion action.
## Action
Serialize the event and run:
`python scripts/runtime_intent_guard.py --event <event.json> --policy config/policy.json`
## Expected result
Exit 0 only when the resource intent and completion action are consistent.
## Failure behavior
Exit 3 blocks the optimized admission/completion path and falls back to a correctness-preserving host path; exit 2 blocks malformed input.
## Blocks completion
Yes when unsafe disposal or unnecessary tool-runtime inheritance would occur.
