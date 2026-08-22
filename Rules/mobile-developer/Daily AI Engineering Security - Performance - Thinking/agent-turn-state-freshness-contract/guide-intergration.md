# Integration Guide

## Integration boundary
Place the freshness contract at the orchestration/state layer, not only in prompts. The critical boundaries are:

`user input -> turn admission -> state/checkpoint -> model/tools -> terminal candidate -> finalization gate -> persisted final response`

Retry/resume adds a second boundary:

`error/interruption -> reconcile in-flight work -> persist -> reload latest revision -> rebuild retry -> freshness gate`

## Required state model
Introduce at minimum:

```text
thread_id            conversation identity
active_turn_id       current request authority identity
state_revision       optional monotonic durable revision
<terminal field>     { owner_turn_id, produced_at_revision?, value }
<evidence item>      { owner_turn_id, produced_at_revision?, value }
```

Do not make every memory value turn-scoped. User preferences, durable facts, and other intended conversation memory may remain thread-scoped.

## Turn admission
At the earliest accepted-request boundary:

1. load the newest durable state;
2. generate a new UUID/ULID for `turn_id`;
3. set `active_turn_id` and `turn_id`;
4. invalidate the configured terminal fields;
5. persist this boundary before downstream work where the framework permits it.

CLI example for adapters that serialize state to JSON:

```bash
python scripts/turn_state_guard.py init \
  --state state-before.json \
  --policy config/turn-state-policy.json \
  --turn-id turn-20260820-001 \
  --output state-after.json
```

## Producing terminal/evidence state
Wrap turn-scoped values instead of writing bare values:

```json
{
  "owner_turn_id": "turn-20260820-001",
  "produced_at_revision": 41,
  "value": {"status": "pass"}
}
```

The helper can stamp adapter-generated data:

```bash
python scripts/turn_state_guard.py stamp \
  --turn-id turn-20260820-001 \
  --revision 41 \
  --value '{"status":"pass"}'
```

## Replacing presence-based routing
Unsafe persisted-turn pattern:

```python
if "structured_response" in state:
    return END
```

Required pattern:

```python
candidate = state.get("structured_response")
if candidate and candidate.get("owner_turn_id") == state["active_turn_id"]:
    return END
```

Prefer one centralized predicate used by all finalizers rather than copying this logic.

## Pre-finalization gate
Serialize or adapt your state to the policy contract and run:

```bash
python scripts/turn_state_guard.py validate-state \
  --state final-state.json \
  --policy config/turn-state-policy.json
```

Exit code `0` permits finalization. Exit code `3` means stale/missing ownership was detected. The runtime should reload latest durable state once and re-evaluate. If validation still fails, terminate explicitly rather than choosing an older terminal value.

## LangGraph / LangChain adapter
LangGraph checkpoints preserve thread state across runs. Add turn admission middleware or an entry node that clears turn-scoped terminal fields and sets a new turn ID. Ensure custom reducers do not accidentally accumulate terminal wrappers from previous turns into the authoritative field.

For `create_agent` structured output, treat `structured_response` as turn-scoped terminal state. If your framework version owns that field internally, maintain a parallel `structured_response_owner_turn_id` or finalization wrapper in middleware and validate before returning it to the caller.

## OpenAI Responses-style adapter
When using persisted application state around `previous_response_id` or conversations, assign the application-level `turn_id` independently. Provider response identity is valuable correlation data but does not replace the application's definition of the current business/user turn. Tool results stored by the application should be correlated to both response/run identity and active turn where possible.

## Retry integration
Do not construct the model request once outside a retry loop if state can change while the attempt is running.

Required sequence:

1. cancel creation of new work;
2. drain/reconcile already-completed tool futures;
3. persist their results with owner metadata;
4. fetch latest durable revision/checkpoint;
5. reconstruct messages/tool results from that revision;
6. validate active turn ownership;
7. retry once.

## Stream/replay integration
Historical events may be useful for UI hydration, but they must not complete the current submit unless correlated to the active run/turn. Maintain two channels conceptually:

- `history`: replayed, non-authoritative for current completion;
- `live_current_run`: events whose run/turn boundary matches the active request.

## Observability
Emit counters without logging sensitive payload content:

- `turn_state.stale_terminal_blocked`
- `turn_state.foreign_evidence_blocked`
- `turn_state.missing_owner_blocked`
- `turn_state.refresh_recovery`
- `turn_state.refresh_exhausted`
- `turn_state.finalization_success`

Dimensions may include framework, terminal field name, agent version, and retry stage, but avoid raw prompts/tool output.

## Rollout
1. **Audit mode:** detect and log violations without altering finalization; compare expected impact.
2. **Shadow validation:** compute would-block decisions and investigate false positives.
3. **Fail-closed for terminal state:** enforce ownership on finalization while keeping non-terminal memory unchanged.
4. **Retry freshness:** migrate retries to newest durable state reconstruction.
5. **Replay correlation:** separate historical events from current-run authoritative events.
6. **Regression gate:** make tests mandatory for state/finalizer changes.

## Compatibility and customization
If a framework cannot modify its built-in state schema, keep an external ownership ledger keyed by `(thread_id, field_name)` with `owner_turn_id` and durable revision. The finalization gate must consult that ledger before trusting the framework's terminal value.

If some approvals or evidence are intentionally reusable across turns, define a separate explicit policy for reusable scope and expiry. Do not silently treat all prior-turn evidence as reusable.
