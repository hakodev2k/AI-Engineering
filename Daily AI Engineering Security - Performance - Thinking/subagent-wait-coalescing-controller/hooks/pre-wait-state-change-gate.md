# Hook: Pre-wait State Change Gate

## Trigger
Before issuing a model-visible wait/status/list-agent call for an already-known child.

## Preconditions
The previous state fingerprint, last material-change timestamp, current child snapshot, and wait-target identity are available.

## Action
Validate target existence; compute current fingerprint; if unchanged, apply bounded backoff and suppress a model-visible turn until the next poll/checkpoint. If changed or critical, emit immediately.

## Command
`python3 scripts/wait_loop_analyzer.py events.jsonl --max-no-change-ratio 0.80`

The analyzer is a verification/diagnostic command; the host must implement the actual event coalescing.

## Expected result
Valid target, bounded polling, and no repeated model-visible no-change events above policy threshold.

## Failure behavior
Invalid target blocks another wait and requests one re-plan/reconciliation. Stale child permits one reconciliation attempt. Critical state bypasses the gate.

## Blocking
Blocks redundant wait dispatch, but never blocks delivery of terminal/error/cancellation/approval/security events.