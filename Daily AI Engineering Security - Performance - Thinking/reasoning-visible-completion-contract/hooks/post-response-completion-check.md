# Hook: Post-Response Completion Check

## Trigger
Immediately after a model response is normalized by the provider adapter and before the turn is persisted/delivered/marked successful.

## Preconditions
Normalized response exposes terminal reason plus observable text/content, tool/function calls, structured output, and explicit no-reply state when applicable.

## Action
Classify the response using the completion policy. Accept only an allowed observable outcome. Treat truncation as incomplete. Treat terminal empty output as recoverable only while retry budget remains.

## Script/command
Offline trace verification:
```bash
python scripts/validate_response_trace.py trace.jsonl --policy config/completion-policy.example.json
python -m unittest tests/test_validate_response_trace.py
```

Runtime integration should call the same predicate semantics before success state transitions.

## Expected result
Valid text/tool/structured/no-reply responses pass; terminal-empty and truncation cases do not become silent success; exhausted recovery is explicit.

## Failure behavior
Block task-success transition. If retry budget remains, request a concise external result. Otherwise emit explicit typed failure and stop.

## Blocking
Yes. Completion validation failure blocks success, but does not permit infinite retry.
