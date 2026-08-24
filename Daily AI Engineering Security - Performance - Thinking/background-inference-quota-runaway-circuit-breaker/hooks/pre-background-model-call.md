# Hook — Pre-Background Model Call

## Trigger
Immediately before any quota-consuming model request initiated by a background worker.

## Preconditions
Worker ID, logical turn ID, pending-input flag, follow-up-required flag, progress fingerprint, request count, and timestamp are available.

## Action
Append the pre-call state event to the guard input and evaluate worker/turn policy before authorizing the next request.

## Script/command
`python scripts/inference_loop_guard.py events.jsonl --max-same-turn-requests 5 --max-no-progress-seconds 120`

## Expected result
Exit `0` for admissible history.

## Failure behavior
Exit `1`: telemetry is invalid, so autonomous call admission fails closed. Exit `2`: circuit breaker opens; do not issue the model request, preserve evidence, and enter bounded recovery/escalation.

## Blocks completion
The hook blocks the model call, not truthful task completion reporting. The parent task MUST remain incomplete/blocked until recovery or explicit resolution.
