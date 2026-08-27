# Hook: Pre Next Step Circuit Check

## Trigger
Immediately before any autonomous continuation, retry, background follow-up, or verification rerun.

## Preconditions
Current task trace exists and uses the event fields consumed by the guard; policy is readable.

## Action
Run:
`python scripts/progress_guard.py --trace <task-trace.jsonl> --policy config/policy.json`

## Expected result
Exit `0` permits one next step. Exit `3` opens the circuit. Exit `2` indicates invalid/missing evidence and also blocks continuation.

## Failure behavior
Preserve trace, policy hash, and reason codes. Do not invoke the model/tool again. Require the recovery workflow.

## Blocking
Yes. Any non-zero result blocks autonomous continuation.
