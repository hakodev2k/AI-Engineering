# Hook — Post-Tool Progress Check

## Trigger
Immediately after each tool result or tool failure is recorded.

## Preconditions
The run can emit a JSONL event with `step`, `tool`, `args`, `status`, `progress`, and optional `error_class`, `result_digest`, and `state_fingerprint`.

## Action
Append the event to the current run log and execute:

`python3 scripts/progress_guard.py run.jsonl --policy config/policy.json --strict`

## Expected result
- Exit 0: continue.
- Exit 3: recover or terminate according to the JSON decision.
- Exit 2: malformed telemetry/policy; fall back to hard step limit and block verification.

## Failure behavior
Do not automatically repeat the same failing call. Require a changed recovery input or stop.

## Blocks completion
Yes when the run terminated for no progress or when progress telemetry is invalid.
