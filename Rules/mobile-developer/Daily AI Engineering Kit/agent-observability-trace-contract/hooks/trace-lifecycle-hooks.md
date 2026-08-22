# Trace Lifecycle Hooks

## Pre-task hook
**Trigger:** before agent workflow execution.

**Preconditions:** writable artifact directory and configured policy.

**Action:** initialize trace context and emit `task.started`.

**Command:**
```bash
python scripts/emit-trace-event.py --trace traces/run.jsonl --event task.started --trace-id "$TRACE_ID" --span-id "$ROOT_SPAN_ID" --actor "$AGENT_ID" --attributes-json metadata.json
```

**Expected result:** event appended and validator accepts the current trace prefix.

**Failure behavior:** block execution if trace cannot be initialized for workflows marked `trace_required`.

## Pre-tool hook
**Trigger:** immediately before a tool call.

**Action:** emit `tool.started` with tool name, operation class, attempt, input fingerprint, and side-effect class.

**Failure behavior:** if telemetry is mandatory and the event cannot be persisted locally, block the tool call.

## Post-tool hook
**Trigger:** immediately after tool return, error, timeout, or unknown outcome.

**Action:** emit `tool.completed`, `tool.failed`, or `tool.unknown` and preserve attempt metadata.

**Failure behavior:** never erase the pre-tool event; mark observability incomplete if terminal evidence cannot be persisted.

## Pre-retry hook
**Trigger:** before retrying a failed/unknown operation.

**Action:** emit `retry.scheduled` referencing the prior span and reason. Ensure retry attempt number increases and policy budget is not exceeded.

**Failure behavior:** block retry when first-attempt evidence is missing or retry budget is exhausted.

## Approval hook
**Trigger:** before approval-required action.

**Action:** emit `approval.requested`, stop, then record the explicit human decision as a separate event.

**Failure behavior:** denial, expiry, or missing approval blocks the dangerous action.

## Final verification hook
**Trigger:** before workflow completion.

**Action:**
```bash
python scripts/validate-trace.py --trace traces/run.jsonl --policy config/trace-policy.json --output artifacts/trace-validation.json
python scripts/evaluate-trace-gate.py --trace traces/run.jsonl --policy config/trace-policy.json --review artifacts/review.json --output artifacts/trace-gate.json
```

**Expected result:** gate status `verified`.

**Failure behavior:** any non-zero exit blocks a verified completion claim.
