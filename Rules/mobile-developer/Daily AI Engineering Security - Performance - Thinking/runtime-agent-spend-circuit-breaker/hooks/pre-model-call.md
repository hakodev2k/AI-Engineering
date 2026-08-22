# Hook: Pre-Model-Call Budget Gate

## Trigger
Immediately before dispatching any provider model request, including parent calls, subagent calls, retries, hooks that invoke models, and plugin-driven model calls.

## Preconditions
- Task, agent, source, model, and attempt identities exist.
- Current budget state is durable and readable.
- Model pricing is present in `config/budget.json` or an explicitly reviewed fallback policy exists.
- Input-token estimate and maximum output token request are known.

## Action
Invoke the reservation gate before network dispatch:

```bash
python scripts/spend_guard.py reserve \
  --config config/budget.json \
  --state /durable/path/task-budget-state.json \
  --task "$TASK_ID" \
  --agent "$AGENT_ID" \
  --source "$SPEND_SOURCE" \
  --model "$MODEL_ID" \
  --input-tokens "$ESTIMATED_INPUT_TOKENS" \
  --max-output-tokens "$MAX_OUTPUT_TOKENS"
```

Persist the returned `reservation_id` with the provider request. After completion, reconcile using actual usage.

## Expected result
- Exit `0`: dispatch is allowed.
- Exit `3`: wrap-up mode; dispatch only a bounded finalization call that fits the reservation and starts no new optional work.
- Exit `4`: block dispatch and return budget-exhausted state.
- Exit `2`: invalid accounting/configuration; block dispatch.

## Failure behavior
Any inability to obtain a valid budget decision blocks the new model call. A production implementation SHOULD use transactional or single-writer state; the bundled script intentionally documents that its local JSON state is not a concurrent multi-writer store.

## Blocking
Yes. This hook is a hard control and MUST run before a spend-producing request leaves the runtime.
