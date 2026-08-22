# Integration Guide

## Goal
Insert a deterministic waiting boundary between long-running work and the LLM so unchanged state does not cause a new model turn.

## Integration boundary
Place the broker after a process/subagent/tool has been launched successfully and before the parent would otherwise call `wait`, `status`, `write_stdin`, or equivalent repeatedly.

```text
model decides work -> runtime starts target -> wait broker owns passive wait
                                              |
                                              +-> unchanged: host waits/polls only
                                              +-> progress threshold: compact wake event
                                              +-> completed/failed/cancelled: terminal wake
                                              +-> user input/deadline/error: explicit wake
model re-enters only after wake event
```

## 1. Instrument before changing behavior
Export model turns and tool calls into JSONL compatible with `scripts/wait_metrics.py`. A model turn should include `input_tokens`, `output_tokens`, `tool_calls`, and optional `decision`/`action` fields. Run:

```bash
python scripts/wait_metrics.py trace.jsonl --json-out baseline.json
```

Do not classify a status call as waste when the model actually makes a decision from it.

## 2. Define target-state adapters
Every waitable target needs:
- stable `target_id`;
- `status` with documented terminal values;
- optional normalized progress from 0 to 1;
- optional version/update timestamp;
- deterministic state query that does not invoke the LLM;
- cancellation endpoint when applicable.

Recommended normalized state:

```json
{
  "status": "running",
  "progress": 0.42,
  "version": 8,
  "updated_at": "2026-08-20T02:00:00Z"
}
```

## 3. Prefer events
If the process runner/subagent framework exposes completion futures, callbacks, async events, pub/sub, or OS process handles, subscribe once and wake from that signal. Avoid adding a timer simply because the previous architecture polled.

## 4. Poll only as fallback
When no event stream exists, poll in host code. Start short enough for acceptable responsiveness, then back off on unchanged state. `config/wait-policy.json` defaults to 5 seconds and backs off to 60 seconds. Adjust by target class.

The important property is not the exact interval: **unchanged polls must not create model turns**.

## 5. Wake contract
The broker should send a compact structured event to the orchestrator:

```json
{
  "target_id": "build-42",
  "wake_reason": "completed",
  "elapsed_seconds": 623.1,
  "polls": 17,
  "state": {"status":"completed","progress":1.0}
}
```

Allowed wake classes normally include `completed`, `failed`, `cancelled`, `material_progress`, `user_input`, `deadline`, and `broker_error`. Unchanged state is not a wake reason.

## 6. Invalid target handling
Reject missing IDs and sentinel values such as `noop`. The runtime should never ask the model what to do with an invalid wait handle in a repeated loop. Surface a single structured error.

## 7. User interruption
User input must preempt passive waiting. The broker should cancel its local wait subscription/poll loop and return control immediately. This is independent of whether the underlying target is cancelled.

## 8. Progress coalescing
Many jobs produce noisy progress ticks. Configure a minimum material delta. The reference policy uses 5 percentage points. For targets without meaningful numeric progress, prefer semantic milestones or terminal-only wake-up.

## 9. Provider errors
Use bounded retries in host code. After the threshold, return `broker_error` to the orchestrator. Do not silently keep polling and do not invoke the model on every provider failure.

## 10. Multi-agent systems
A parent coordinating N workers should register each worker with the broker and wait on a set/future collection. Wake on:
- any required worker failure;
- all required workers complete;
- a milestone requiring parent decision;
- user input/deadline.

Do not wake the parent model every 30 seconds simply to enumerate still-running workers.

## 11. Long builds/tests
For shell processes, the process runner can use OS-level process completion as the primary event and bounded log streaming separately. Log availability should not require a model turn. If logs need inspection, trigger model re-entry only on configured anomaly signals or user request.

## 12. Observability
Record:
- target class and anonymized/stable target ID;
- wait start/end;
- host poll count;
- state-change count;
- wake reason;
- model re-entry reason;
- detection lag;
- broker errors;
- wait-only model turns/tokens from pre/post traces.

Never place secrets or raw command output in wait metrics.

## 13. Rollout
1. Observe-only: identify wait-only turns without behavior change.
2. Canary one target class such as build/test jobs.
3. Compare before/after and detection SLA.
4. Expand to subagents/background tasks.
5. Add release regression gate.

Rollback by routing wait ownership back to the old runtime path; keep instrumentation enabled so regression is visible.

## 14. CI gate
Run:

```bash
python -m unittest discover -s tests -v
python scripts/wait_metrics.py examples/sample-trace.jsonl
```

For production release, compare real before/after traces. Static tests prove contract behavior, not real token savings.

## Security and correctness
This package changes scheduling, not permissions. Existing tool approvals, sandbox restrictions, cancellation authorization, credential controls, and output filtering must remain unchanged. Never use reduced model involvement to bypass a required human approval or failure check.