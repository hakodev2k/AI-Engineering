# Integration Guide

## Goal
Place the guard at the boundary between tool completion and model/transcript insertion so large outputs are budgeted before they consume context.

## 1. Choose the interception point
Integrate immediately after the tool returns raw bytes/text, before:
- adding the result to the LLM message list;
- writing model-facing summaries;
- retry/replay state that automatically restores the full output.

The guard should receive raw output, tool name, task id/call id, active model budget, and policy.

## 2. Configure the policy
Start with `config/policy.json`. Tune using measured production traces rather than arbitrary values.

Important fields:
- `model_visible_token_budget`: maximum approximate tokens for one model-facing tool result envelope;
- `hard_raw_bytes_limit`: fail-closed limit for unexpectedly huge payloads;
- `head_lines` / `tail_lines`: setup/final-state evidence;
- `priority_patterns`: deterministic error/failure evidence extraction;
- `spill_directory`: protected artifact root;
- `rehydrate_max_lines` / `rehydrate_max_bytes`: targeted read bounds.

If your runtime exposes exact tokenizer counts, replace the approximate budget check at the integration layer while keeping the deterministic artifact/envelope behavior.

## 3. Guard every tool result
Example:
```bash
python scripts/tool_output_guard.py guard \
  --input /tmp/tool-output.txt \
  --tool-name dotnet-test \
  --policy config/policy.json \
  --output /tmp/model-visible.json \
  --events /tmp/tool-output-events.jsonl
```

Read `/tmp/model-visible.json` and insert only that result into model context.

### Pass-through
Small text output returns:
- `mode=pass-through`
- `spilled=false`
- complete `content`

### Spill
Oversized output returns:
- `mode=spill`
- `spilled=true`
- artifact path and SHA-256
- raw byte/line/token estimates
- extracted source lines
- omitted-line count
- explicit notice that the slice is incomplete

Never strip the notice or provenance before handing the envelope to the agent.

## 4. Secure the spill store
The demonstration script uses a local directory. Production integrations should:
1. place it outside source-controlled paths;
2. inherit or exceed source tool data classification controls;
3. apply per-task/tenant access boundaries;
4. avoid public/shared caches unless the data classification explicitly permits them;
5. apply retention/deletion policy;
6. use encrypted storage where required;
7. never publish artifact paths as externally reachable URLs by default.

When a platform supports MCP resource links, LangChain artifacts, object storage handles, or equivalent non-model-facing artifact channels, adapt the envelope to use that native reference while retaining hash/provenance fields.

## 5. Rehydrate only targeted evidence
When the current slice is insufficient:
```bash
python scripts/tool_output_guard.py rehydrate \
  --artifact .agent-tool-output-spill/<sha>.txt \
  --sha256 <expected-sha> \
  --policy config/policy.json \
  --search "timeout" \
  --context 3
```

Or request a bounded line range:
```bash
python scripts/tool_output_guard.py rehydrate \
  --artifact .agent-tool-output-spill/<sha>.txt \
  --sha256 <expected-sha> \
  --policy config/policy.json \
  --start-line 800 \
  --end-line 950
```

Do not let the model request unbounded full-artifact replay by default. A larger read should be an explicit budget decision.

## 6. Structured outputs
For JSON, tables, test reports, traces, or compiler diagnostics, production adapters SHOULD add format-aware projection before generic line extraction. Examples:
- JSON: select error/status/result fields plus record counts;
- test reports: failed tests, summary counts, relevant stack traces;
- build logs: final failure diagnostics and bounded surrounding context;
- database plans: expensive nodes + top-level plan metadata;
- API collections: page/count/IDs with full records in artifact storage.

The raw artifact remains source of truth.

## 7. Retry and recovery
If guard storage fails:
- retry artifact write at most once;
- do not fall back to injecting oversized raw output;
- return a structured blocking error.

If artifact hash fails during rehydrate:
- stop;
- do not use the corrupted/mismatched payload;
- regenerate from the original source or rerun the originating tool only if safe and necessary.

This guard does not make side-effecting tool reruns safe; combine it with an idempotency/replay guard for such tools.

## 8. Metrics
Aggregate events:
```bash
python scripts/tool_output_guard.py analyze --events /tmp/tool-output-events.jsonl
```

Production dashboards should track at least:
- p50/p95 raw tool-output tokens/bytes;
- p50/p95 model-visible tokens/bytes;
- spill rate by tool;
- rehydrate calls/task;
- full-output fallback count;
- spill I/O latency/error rate;
- answer/test quality regression rate.

## 9. Verification
Run:
```bash
python tests/test_tool_output_guard.py
```

Then use representative production/replay tasks to compare:
- token/cost/latency before vs after;
- final answer/build/test correctness;
- whether required evidence can be recovered;
- whether agents repeatedly rehydrate because extraction is too aggressive.

Do not mark the optimization Verified until measurable savings exist without violating correctness/security thresholds.

## 10. Rollout
Recommended order:
1. observe-only measurement;
2. spill shadow mode while still retaining baseline responses for evaluation;
3. enforce on the noisiest low-risk tools;
4. validate task quality and rehydrate rate;
5. expand by tool class;
6. tune budgets using measured data.

Rollback is disabling model-facing replacement while preserving measurement, not deleting artifacts or evidence needed for active tasks.