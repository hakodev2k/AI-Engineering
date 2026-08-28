# Hook: Pre Next Model Turn
## Trigger
Before the next model request after tool activity or approval resume.
## Preconditions
Lifecycle events for the batch are available.
## Action
Run `python scripts/tool_call_ledger.py <events.jsonl>`.
## Expected result
Only `complete` permits normal advancement; `wait` pauses within policy; `block` terminates automatic progression.
## Failure behavior
Parse/ledger failure blocks progression because evidence is incomplete.
## Blocking
Yes.
