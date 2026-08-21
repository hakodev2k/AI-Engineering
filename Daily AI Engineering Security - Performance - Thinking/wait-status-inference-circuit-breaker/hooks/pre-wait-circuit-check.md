# Hook: Pre-Wait Circuit Check

## Trigger
Before a coordination-only wait/status action can cause another model turn.

## Preconditions
The runtime has the target identity, previous normalized observation signature, repetition count, and target terminal/running state.

## Action
Compare the new observation with the previous signature. If unchanged, increment the no-progress count. At count 3 switch to backoff/event waiting; at count 5 block further model-turn polling until target state changes, a deadline fires, or explicit human input arrives.

## Expected result
No model inference is triggered for unchanged timeout/no-op observations after the configured breaker threshold.

## Failure behavior
If target identity is unknown, do not assume progress; emit a diagnostic and stop automated polling after one validation retry.

## Blocking
Yes for additional coordination-only inference. No for confirmed external process execution itself.

## Verification
Replay traces through `scripts/wait_loop_analyzer.py`; breaker candidates must correspond to suppressed no-progress turns and no real state-change event may be skipped.