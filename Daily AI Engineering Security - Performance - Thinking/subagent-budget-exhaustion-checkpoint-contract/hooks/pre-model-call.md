# Hook: Pre Model Call Budget Admission

## Trigger
Immediately before every provider/model dispatch in a bounded subagent run.

## Preconditions
Task budget, cumulative usage estimate, conservative next-call token estimate, and current durable checkpoint state are available.

## Action
Serialize an event containing `task_id`, `budget_tokens`, `used_tokens`, `estimated_next_call_tokens`, and checkpoint fields. Run:

`python scripts/budget_checkpoint_guard.py --event <event.json> --policy config/policy.json`

## Expected result
- Exit 0 / `continue`: dispatch permitted.
- Exit 0 / `checkpoint_then_continue`: persist checkpoint before dispatch.
- Exit 3 / `checkpoint_and_yield`: do not dispatch; persist/verify checkpoint and return `partial_budget_exhausted`.

## Failure behavior
Invalid accounting or missing state blocks dispatch. Preserve the last valid checkpoint and report a machine-readable reason.

## Blocks completion
No for valid completed tasks; yes for unsafe provider dispatch and false completion after budget exhaustion.
