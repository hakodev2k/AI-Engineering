# Integration Guide

## Purpose
Integrate prompt-cache health into an agent runtime without coupling the runtime to a specific provider.

## 1. Emit normalized request telemetry
Write one JSON object per completed model request:

```json
{
  "type": "request",
  "seq": 42,
  "provider": "openai",
  "model": "example-model",
  "input_tokens": 52000,
  "cache_read_tokens": 47000,
  "cache_creation_tokens": 0,
  "latency_ms": 1840,
  "system_prompt_hash": "sha256:...",
  "tool_schema_hash": "sha256:...",
  "mcp_topology_hash": "sha256:...",
  "reasoning_effort": "medium",
  "prompt_cache_key": "project-agent-v1",
  "compaction_generation": 2
}
```

Provider adapters should map native usage fields into the normalized fields. For OpenAI, `usage.input_tokens_details.cached_tokens` maps to `cache_read_tokens`; if explicit cache-creation tokens are unavailable, set `cache_creation_tokens` to `0` and document that creation amplification is not observable for that provider. For Anthropic/Claude telemetry, map cache-read and cache-creation fields when available.

Hashes must cover canonicalized cache-relevant content. Sort tool schemas by stable tool identifier before hashing if runtime order is not semantically meaningful; otherwise preserve provider-visible order exactly. Never put secret values in fingerprint source material or telemetry.

## 2. Emit known invalidator events
When the harness knows that a cache-breaking lifecycle action occurred, append an ordered event:

```json
{"type":"invalidator","seq":42,"kind":"mcp_connect"}
```

Supported default kinds are in `config/policy.json`. Extend them only when the runtime has deterministic evidence that the event can change a cache-relevant prefix.

## 3. Validate instrumentation

```bash
python scripts/cache_health.py validate \
  --input telemetry.jsonl \
  --policy config/policy.json
```

Do this before collecting a benchmark. Validation failure means cache conclusions are blocked, not that caching failed.

## 4. Establish a baseline
Run a representative workload without changing model/tool topology mid-run unless that lifecycle is part of the workload.

```bash
python scripts/cache_health.py analyze \
  --input baseline.jsonl \
  --policy config/policy.json \
  --output baseline-report.json
```

A baseline should itself pass policy. Do not bless a failing baseline merely because it is current production behavior.

## 5. Integrate cache-relevant runtime changes
Typical candidates:
- stable `prompt_cache_key` bucketing where supported;
- stable ordering of reusable prompt/tool prefix content;
- reducing unnecessary MCP reconnects;
- avoiding needless model switches inside one logical task;
- choosing compaction/truncation boundaries deliberately;
- preserving stable tool topology across adjacent turns.

Do not remove required tools, system/security instructions, or evidence simply to make a cache ratio higher.

## 6. Analyze the candidate

```bash
python scripts/cache_health.py analyze \
  --input candidate.jsonl \
  --policy config/policy.json \
  --output candidate-report.json
```

The analyzer detects strong high-read-to-low-read transitions. It classifies each as:
- `explained_known_invalidator`,
- `explained_fingerprint_change`, or
- `unexplained`.

This is an operational heuristic, not proof of provider internals.

## 7. Gate the comparison

```bash
python scripts/compare_cache_runs.py \
  --baseline baseline-report.json \
  --candidate candidate-report.json \
  --policy config/policy.json \
  --output comparison.json
```

Also run the workload's correctness tests. The cache gate is only one part of verification.

## 8. CI example

```bash
set -euo pipefail
python -m unittest tests/test_cache_health.py
python scripts/cache_health.py analyze --input artifacts/cache-baseline.jsonl --policy config/policy.json --output artifacts/cache-baseline-report.json
python scripts/cache_health.py analyze --input artifacts/cache-candidate.jsonl --policy config/policy.json --output artifacts/cache-candidate-report.json
python scripts/compare_cache_runs.py --baseline artifacts/cache-baseline-report.json --candidate artifacts/cache-candidate-report.json --policy config/policy.json --output artifacts/cache-comparison.json
./run-correctness-tests.sh
```

## 9. Production observability
Dashboard at least:
- token-weighted cache-read ratio by provider/model/runtime version;
- unexplained resets per 100 eligible requests;
- cache-creation tokens where observable;
- p50/p95 latency;
- known invalidator count;
- task success/error rate.

Alert on sustained regression or repeated unexplained resets, not a single legitimate miss.

## 10. Failure handling
- **Malformed telemetry:** stop cache gate and repair instrumentation.
- **Insufficient eligible requests:** collect more representative traffic; do not lower the minimum just to pass.
- **Expected reset:** quantify transition cost and recovery, then continue.
- **Unexplained reset:** inspect fingerprint and lifecycle evidence; run at most two controlled experiments.
- **Provider metrics unavailable:** mark unobservable fields; do not invent cache creation numbers.
- **Optimization harms correctness/security:** reject it regardless of cache gains.
