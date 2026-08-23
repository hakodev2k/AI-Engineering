# Hook: Terminal State Canary

## Trigger
Before releasing changes to stream/watchdog/cancellation/hook lifecycle behavior.

## Preconditions
A controlled test can inject a recoverable stream/transport failure without executing irreversible tools.

## Action
Capture the normalized event trace for the canary and run `scripts/recovery_trace_validator.py`.

## Command
```bash
python scripts/recovery_trace_validator.py canary-trace.json --max-retries 2 --expected-cause stream_stall
```

## Expected result
Exit `0`; the trace attributes the fault to a machine cause, records recovery dispatch/completion when configured, respects retry budget and contains one final event.

## Failure behavior
Exit `2` blocks release as a contract violation. Exit `3` blocks release because evidence is malformed/incomplete.

## Blocks completion
Yes. Do not waive a misclassified user-cancel or missing terminal event.
