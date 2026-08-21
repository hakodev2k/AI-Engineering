# Hook — Pre Model Status Emission

## Trigger
After a status poll returns and before its result is appended to model-visible context.

## Preconditions
Current normalized status, previous status fingerprint, poll count, elapsed wait, and policy configuration exist.

## Action
Run the controller decision in `scripts/poll_guard.py`. Emit only `emit`, `terminal`, or `circuit-break` events to the model; keep `suppress` events in compact telemetry.

## Expected result
Unchanged non-terminal polls are suppressed with a bounded next interval. Material changes reset backoff. Terminal states are emitted immediately.

## Failure behavior
If normalization/controller input is invalid, do not silently suppress. Retry collection once, then emit a compact `status-unknown` escalation and stop autonomous polling.

## Blocking
Yes when poll/wall-clock budgets are exhausted or an identical deterministic failure reaches the circuit-break threshold.