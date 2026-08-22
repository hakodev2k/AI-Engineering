# Integration Guide

## Goal
Insert a deterministic progress guard at the boundary between agent planning and tool execution so repeated/non-progressing tool calls can be warned, redirected, or blocked before they consume more latency/tokens.

## Integration boundary

```text
Model proposes tool call
        ↓
Host builds candidate.json
        ↓
pre_tool_call → tool_loop_guard.py decide
        ↓
 allow/warn ──────────────→ execute tool
 require-strategy-change ─→ recovery packet; no execution
 block ───────────────────→ stop/escalate; no execution
 verify-before-retry ─────→ postcondition verification; no replay yet
        ↓
post_tool_call → record result digest + metrics
        ↓
Agent receives tool result / structured guard event
```

The guard is host-side. Do not let the model directly mutate guard state or policy.

## 1. Copy package components
Required runtime components:

- `scripts/tool_loop_guard.py`
- `config/policy.json`
- persistent or task-scoped state path such as `runtime/guard-state.json`

Recommended operational components:

- `scripts/analyze_trace.py`
- `hooks/hooks.md`
- `tests/test_tool_loop_guard.py`

## 2. Register tool classes
Update `config/policy.json` for every tool exposed by your runtime.

Use:
- `read-only`: deterministic/non-mutating observation.
- `side-effecting`: writes, sends, deletes, external mutations.
- `unknown`: safest default until reviewed.

Do not label a tool read-only merely because its name sounds harmless. Classify by actual implementation and credentials.

## 3. Build a candidate call
Before execution, serialize:

```json
{
  "tool": "grep",
  "arguments": {
    "query": "ToolLoopGuard",
    "path": "src"
  },
  "phase": "explore",
  "prior_status": ""
}
```

`phase` should be stable for the current stage, e.g. `explore`, `implement`, `test`, `deploy`.

## 4. Request a decision

```bash
python scripts/tool_loop_guard.py decide \
  --policy config/policy.json \
  --state runtime/guard-state.json \
  --call candidate.json
```

Interpret decisions:

### `allow`
Execute normally.

### `warn`
Execute if appropriate, but pass the structured warning to the orchestrator. The next similar call will face stricter thresholds.

### `require-strategy-change`
Do not execute candidate. Require a new strategy: synthesize existing evidence, change source/tool/scope, proceed to implementation/testing, or explicitly identify a missing evidence target.

### `block`
Do not execute. Create/preserve recovery packet and stop that loop family or phase.

### `verify-before-retry`
The previous attempt may have produced a side effect despite an error/timeout. Verify external state before any replay.

## 5. Record execution results
After an allowed/warned call completes, serialize:

```json
{
  "status": "success",
  "output": {
    "matches": ["src/guard.py:42"]
  },
  "elapsed_ms": 87
}
```

Then:

```bash
python scripts/tool_loop_guard.py record \
  --policy config/policy.json \
  --state runtime/guard-state.json \
  --call candidate.json \
  --result result.json
```

The script stores output digest rather than requiring repeated raw output in state.

## 6. Preserve full traces separately
The guard state is optimized for decisions, not audit retention. Emit a JSONL trace from your orchestrator with fields such as:

```json
{"tool":"grep","phase":"explore","exact_fingerprint":"...","family_fingerprint":"...","status":"success","output_digest":"...","elapsed_ms":87}
```

Analyze later:

```bash
python scripts/analyze_trace.py trace.jsonl --policy config/policy.json
```

## 7. Strategy families
Exact duplicates are easy to catch. Near-duplicates need a conservative family definition.

Example:

```json
"familyKeysByTool": {
  "grep": ["path"],
  "search_files": ["path"]
}
```

This groups repeated searches in the same scope even if query text changes. Tune carefully: over-broad families can create false positives.

Never remove arguments from the exact fingerprint merely to improve deduplication.

## 8. Evidence targets
For stronger progress detection, maintain a task-level list:

```json
{
  "required_evidence": [
    "entrypoint located",
    "current behavior confirmed",
    "relevant tests located"
  ],
  "satisfied_evidence": [
    "entrypoint located"
  ]
}
```

When a warning fires, the orchestrator should justify a repeated family by naming an unresolved target. This should be audited; the model does not get unlimited exceptions.

## 9. Safe retry for side effects
For `side-effecting` or `unknown` tools:

1. If timeout/connection loss occurred after dispatch, set `prior_status` to an ambiguous status from policy.
2. Guard returns `verify-before-retry`.
3. Use a separate read-only tool/API to check postcondition.
4. Retry only when external evidence confirms the effect did not occur and the action is safe to repeat.
5. Prefer provider-supported idempotency keys when available.

## 10. Multi-agent systems
Keep guard state per task/agent but also enforce a shared global budget at the coordinator. Otherwise several subagents can each remain under local thresholds while collectively creating a call storm.

Suggested hierarchy:

```text
Global task budget
 ├─ Research agent phase budget
 ├─ Implementation agent phase budget
 └─ Verification agent phase budget
```

A delegated budget must not be silently reset when control returns to the parent.

## 11. Tuning
Start conservatively:
- exact warning: 2 prior repeats;
- exact hard block: 4 prior repeats;
- family warning: 4;
- family hard block: 8;
- one recovery cycle.

Collect traces, then tune based on false positives and real loop incidents.

Do not optimize only for fewer calls. Track completion quality and time-to-correct-result.

## 12. Testing

```bash
python tests/test_tool_loop_guard.py
```

Required scenarios:
- new call allowed;
- whitespace-equivalent call canonicalized;
- repeated exact call warns/blocks;
- phase budget blocks;
- ambiguous side-effect failure requires verification;
- legitimate differentiated calls are not collapsed by exact fingerprinting.

Add workload-specific fixtures for polling, test retries, pagination, and repository exploration.

## 13. Benchmark rollout
Run A/B or trace replay:

### Baseline
Guard disabled, metrics only.

### Shadow
Guard decides but does not block; compare decisions with human/expected labels.

### Enforced read-only
Block only clearly idempotent/read-only loop families.

### Full policy
Enable strategy-change and safe retry rules for all reviewed tools.

Rollback by restoring prior policy version. Never delete traces required to explain a false block.

## 14. Production metrics
Export at minimum:
- `tool_calls_total`
- `tool_guard_warn_total`
- `tool_guard_block_total`
- `tool_guard_strategy_change_total`
- `tool_guard_verify_before_retry_total`
- `tool_calls_avoided_total`
- `tool_repeat_ratio`
- `tool_no_novelty_ratio`
- `task_completion_rate`
- `task_latency_ms`
- `false_positive_override_total`

## 15. Failure handling
If guard internals fail:
- known read-only tools may follow configured allow-with-warning fallback;
- side-effecting/unknown tools fail closed;
- state write failure must not erase the previous valid state;
- second loop during recovery stops/escalates;
- policy parse errors block production enablement.

## 16. Definition of Done
Integration is complete when every tool call crosses the pre-call gate, every executed call is recorded, side-effect ambiguity cannot auto-replay, loop fixtures pass, and before/after production or representative benchmark metrics are available.