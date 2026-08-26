# Hook: Post Tool Result Progress Gate

## Trigger
After each tool result is recorded and before the runtime schedules the next model turn.

## Preconditions
The runtime can provide tool name, arguments, result class, turn, cumulative tokens/time, and current durable progress markers.

## Action
Serialize the event and run:

`python scripts/progress_loop_guard.py --state <run-state.json> --event <event.json> --policy config/policy.json`

## Expected result
- Exit 0 + `continue`: the runtime may schedule the next model turn.
- Exit 4 + `checkpoint_and_stop`: checkpoint safe durable state, emit terminal status, and do not schedule another model turn.
- Exit 4 + `terminal_stuck`: terminate immediately where checkpointing is disabled/unavailable.

## Failure behavior
Malformed/missing observable event data must not fall back to an unlimited retry loop. Route to terminal review or an already-configured stricter hard budget.

## Blocking
Yes when decision is terminal. The model cannot override a terminal decision.
