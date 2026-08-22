# Integration Guide

## Integration boundary

Place the guard **above the tool/SDK execution layer but below model planning**. The host must see every logical operation before another physical attempt is made. SDK transport retries may remain enabled if bounded, but the host must know their count or treat one SDK call as one owned retry domain; do not independently replay the same logical operation at multiple layers.

## Event contract

Emit one structured event per physical attempt with at least:

```json
{
  "timestamp": "2026-08-20T11:00:00+07:00",
  "logical_operation_id": "op-123",
  "layer": "orchestrator",
  "tool": "repo",
  "operation_type": "read",
  "resource": "src/App.cs",
  "arguments": {"path": "src/App.cs"},
  "failure_class": "timeout",
  "result_class": "timeout",
  "progress_marker": null,
  "estimated_tokens": 1200,
  "idempotency_key": null
}
```

Do not persist secrets in arguments. Redact secret values before logging while preserving fields required to distinguish operation semantics.

## Persistent retry state

Persist state keyed by logical fingerprint or host logical-operation ID:

```json
{
  "attempts": 2,
  "run_retries": 5,
  "retry_elapsed_seconds": 18.4,
  "estimated_retry_tokens": 6400,
  "no_progress_duplicates": 1,
  "circuit": "CLOSED",
  "last_progress_marker": "checkpoint:deps-installed"
}
```

State must survive model turns, subagent respawns, workflow restarts, and context compaction. Restarting a child must not reset parent retry budgets.

## Failure classification

Map provider/tool errors into stable classes before deciding:

- `timeout`
- `throttle`
- `transient_network`
- `temporary_unavailable`
- `permission_denied`
- `invalid_input`
- `auth_failed`
- `policy_denied`
- `schema_error`
- application-specific non-retryable classes

Unknown classes fail fast by default. Add a class to retryable policy only after evidence shows retries can succeed safely.

## Host call sequence

1. Build the logical operation object.
2. Compute fingerprint:

```bash
python scripts/retry_guard.py fingerprint --operation operation.json
```

3. Load persistent retry state.
4. After a failure, update failure/progress/token/time counters.
5. Before another attempt, call:

```bash
python scripts/retry_guard.py decide \
  --operation operation.json \
  --state retry-state.json \
  --policy config/retry-policy.json
```

6. Handle decision:
   - `retry`: persist next-attempt state, wait `delay_ms`, execute once;
   - `fail_fast`: return failure to planner/user without local replay;
   - `open_circuit`: stop physical attempts and surface reason;
   - `human_approval_required`: pause side-effect replay until explicit approval.
7. On success with material progress, update progress marker and close eligible HALF_OPEN circuits.

## Idempotency integration

For side-effecting operations, derive or receive an idempotency key from the business operation, not from an ephemeral network request. A retry of the same logical side effect must reuse the same key. Never generate a new idempotency key merely because the agent created a new tool-call ID.

If the prior outcome is unknown and no stable idempotency mechanism exists, automatic replay is forbidden; require human review or a read-after-write reconciliation flow.

## Progress-aware watchdog integration

Emit material progress from host-observable events: artifact created, repository state changed, setup phase completed, test phase advanced, external job status changed, or durable checkpoint saved. Do not accept prose such as “still working” as sufficient progress by itself.

A watchdog should compare `now - last_material_progress_at` against the grace interval, while also enforcing total run duration. If a child must restart, resume from a checkpoint and retain the same logical retry state.

## Trace analysis

Export JSONL and run:

```bash
python scripts/analyze_retry_trace.py retry-trace.jsonl --output retry-report.json
```

Capture a baseline before rollout and a guarded comparison after rollout. At minimum compare:

- retry amplification factor;
- duplicate/no-progress attempts;
- estimated retry tokens;
- total wall-clock retry time;
- transient recovery rate;
- restart-from-zero count;
- circuit-open and false-open rate.

## Rollout

1. **Observe-only:** compute decisions but do not block; measure what would open.
2. **Canary:** enforce on non-side-effecting tools first.
3. **Side-effect protection:** require idempotency or approval.
4. **Workflow watchdog integration:** preserve checkpoints and progress signals.
5. **Broader rollout:** only after transient recovery is not materially worse than baseline.

## Recovery and overrides

Human override may close/open a circuit only with a recorded reason and must not erase prior counters/evidence. Overrides do not change operation idempotency. A retry policy failure should be fixed by policy/code, not by silently raising limits until the loop disappears.

## Security and privacy

- keep secrets out of traces;
- do not hash low-entropy secrets as a substitute for redaction;
- keep auth/policy failures non-retryable;
- do not use retry optimization to bypass approval boundaries;
- preserve audit records for side-effect replay decisions.