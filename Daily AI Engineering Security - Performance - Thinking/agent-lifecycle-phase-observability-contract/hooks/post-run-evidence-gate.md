# Hook: Post-Run Evidence Gate

## Trigger
After a benchmark or agent run is proposed as evidence for a latency conclusion.

## Preconditions
Lifecycle events are exported as JSONL and `config/policy.json` exists.

## Action
Run:

```bash
python scripts/lifecycle_profiler.py path/to/events.jsonl --policy config/policy.json --output lifecycle-report.json
python -m unittest tests/test_lifecycle_profiler.py
```

## Expected result
Profiler exits 0, required phases are complete, event order is valid, tool calls are correlated, and tests pass.

## Failure behavior
Block any component-level performance claim. Label the run `insufficient_evidence`; repair instrumentation rather than guessing missing durations.

## Blocking
Yes for performance verification. It does not block ordinary agent task completion unless the task specifically requires validated performance evidence.
