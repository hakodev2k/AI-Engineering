# Integration Guide

## Integration target
Use this package in an agent runtime, coding-agent harness, MCP host, desktop/CLI wrapper, or CI benchmark that can emit timestamps around tool execution and model continuation.

## 1. Emit the five required phases
For each logical tool cycle, generate a stable `run_id` and `cycle_id` and record:

1. `tool_start` — immediately before dispatch.
2. `tool_end` — when the tool handler returns or fails.
3. `result_ingested` — after the runtime has accepted/deserialized the result into agent state/context.
4. `next_model_start` — immediately before the next model generation/request starts.
5. `next_agent_action` — the first useful response/tool-decision produced after that generation.

Each event must also contain `tool` and an ISO-8601 timestamp with offset.

Do not copy raw tool output into timing events. Store trace IDs and high-level result status separately if needed.

## 2. OpenAI Agents SDK
The SDK already records traces and spans for runner/task/turn/model/function-tool/handoff events. Use those existing spans when they match the boundary. Add a custom span/event only where the default trace cannot distinguish result ingestion from the next model start.

Useful references:
- https://openai.github.io/openai-agents-python/tracing/
- https://openai.github.io/openai-agents-js/guides/tracing/

A host-side adapter should transform exported spans into the normalized JSONL schema consumed by `trace_latency_profiler.py`.

## 3. Raw JSONL/runtime logs
For products that expose timestamped JSONL logs, write a deterministic adapter that recognizes tool-call start/result events and the next model/response event. Never infer a missing phase by copying a neighboring timestamp; emit the cycle as incomplete and instrument the missing boundary.

## 4. Establish baseline
Capture at least five representative cycles with unchanged runtime/security configuration.

```bash
python scripts/trace_latency_profiler.py events-baseline.jsonl --output baseline-summary.json
```

Archive the summary with:
- runtime/app version;
- OS;
- model;
- tool/MCP server version;
- repository/workload revision;
- context-size bucket or compaction state;
- benchmark timestamp.

## 5. Diagnose
Inspect per-cycle and percentile metrics. A high `continuation_tool_ratio` says continuation dominates actual tool work; it does not identify the root cause by itself.

Use targeted instrumentation/experiments to distinguish broker queue, sandbox evaluation, IPC/result ingestion, context hydration/compaction, state persistence, provider/model queueing, or UI delay.

Change one variable at a time and limit diagnosis to three experiment rounds before escalation.

## 6. Verify an optimization
Run the unchanged fixture after the implementation:

```bash
python scripts/trace_latency_profiler.py events-current.jsonl --output current-summary.json
python scripts/latency_regression_gate.py \
  --current current-summary.json \
  --baseline baseline-summary.json \
  --policy config/latency-policy.json \
  --output regression-report.json
```

Exit `0` is the only performance-gate pass. Also run product correctness/security tests before declaring the change verified.

## 7. CI
A recommended job sequence is:

```text
safe benchmark fixture
  -> collect events
  -> profile
  -> fail on incomplete cycles
  -> regression gate
  -> correctness/security tests
  -> store summaries as artifacts
```

Do not automatically update the baseline from a failing candidate. Baseline replacement should be an explicit reviewed action when the workload or target budget intentionally changes.

## 8. Threshold tuning
The default policy is intentionally a starting point, not a universal SLA. Measure healthy production/test distributions first, then set budgets per environment/tool class. Preserve these invariants:
- finite thresholds;
- a minimum sample count;
- no silent threshold relaxation;
- no missing-phase-as-zero behavior;
- no security/correctness weakening for speed.

## 9. Recovery and escalation
If instrumentation fails: repair observability before optimization.

If the dominant phase belongs to an external provider/runtime: attach trace/run IDs, phase timestamps, affected versions, baseline vs slow measurements, and a minimal reproduction to escalation.

If two optimization attempts fail: stop changing code, preserve results, return to diagnosis or escalate ownership.