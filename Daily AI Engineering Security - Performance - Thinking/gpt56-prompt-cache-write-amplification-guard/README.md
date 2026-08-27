# GPT-5.6 Prompt Cache Write Amplification Guard

**Category:** Token

## Problem
Agent workloads can repeatedly write large GPT-5.6 cache prefixes while receiving little cache reuse because dynamic content, unstable keys, tool/schema churn, or rewritten history changes the exact cached prefix.

## Evidence
`evidence/research.md` documents current August 2026 OpenAI and Microsoft guidance plus developer signals around GPT-5.6 cache breakpoints, keys, read/write accounting, and exact-prefix behavior.

## Existing approach
Automatic prompt caching, static-first prompt layout, cache keys, context trimming, and usage dashboards.

## Existing limitations
A large repeated prompt does not guarantee cache reuse. Exact-prefix changes can cause zero reads and repeated writes; aggregate usage can hide workload-specific amplification.

## Proposed improvement
Measure cache reads/writes per logical workload and stable-prefix fingerprint. Gate optimization claims when write amplification, zero-read frequency, cache-key instability, or prefix instability exceed policy.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `config/policy.json` — measurable thresholds.
- `scripts/cache_write_guard.py` — dependency-free JSONL analyzer.
- `tests/test_cache_write_guard.py` — deterministic regression fixtures.
- `skills/cache-efficiency-analysis.md` — investigation and optimization procedure.
- `rules/cache-budget.md` — enforceable token/cache rules.
- `subagents/cache-benchmark-verifier.md` — independent verifier contract.
- `workflows/measure-optimize-verify.md` — bounded optimization workflow.
- `workflows/regression-verification.md` — release regression workflow.
- `hooks/post-benchmark.md` — deterministic benchmark gate.

## Installation
Python 3.10+; no third-party packages.

## Configuration
Tune `config/policy.json` using measured workload behavior. Keep quality requirements outside the cache guard and verify them independently.

## Trace format
One JSON object per line:

```json
{"workload_id":"repo-review","input_tokens":12000,"cached_tokens":9000,"cache_write_tokens":0,"prompt_cache_key":"workspace-a","stable_prefix_fingerprint":"sha256:..."}
```

The fingerprint identifies the intended stable prefix; do not store sensitive prompt content in telemetry.

## Usage
```bash
python scripts/cache_write_guard.py --trace requests.jsonl --policy config/policy.json
```

Exit `0` means measured groups satisfy policy or lack enough evidence to claim a regression. Exit `3` reports measurable violations; exit `2` reports invalid telemetry/configuration.

## Workflow
Use `workflows/measure-optimize-verify.md` for diagnosis and optimization. Use `workflows/regression-verification.md` after prompt, tool/schema, model, routing, key, or compaction changes.

## Metrics
Input tokens/task, cached tokens/task, cache-write tokens/task, write/read ratio, zero-cache-read fraction, latency/task, cost/task, and quality/regression rate.

## Verification
```bash
python -m unittest tests/test_cache_write_guard.py
```
Then compare equivalent before/after workload traces and run the application's correctness/quality tests. Cache metrics alone are insufficient.

## Safety
Never remove correctness-critical context merely to improve caching. Do not log prompt bodies or secrets. Stable fingerprints should be one-way hashes. Preserve the known-correct prompt if optimization harms quality.

## Failure handling
Detection uses reason codes and exit codes. Maximum optimization hypotheses: 2; regression verification allows one correction cycle. Fallback is the last known-correct prompt/cache structure. Escalate ambiguous provider behavior rather than forcing a metric pass.

## Definition of Done
- **Implemented:** prompt/cache structure change is present in the test/staging workload.
- **Measured:** equivalent before/after cache/token telemetry is captured.
- **Verified:** guard/tests pass, target metrics improve or stay within policy, task quality has no critical regression, and an independent verifier confirms the evidence.

## Customization
Adjust policy thresholds by workload class. Keep keys and prefix fingerprints scoped to logical reusable context; do not use cache keys as an authorization or privacy boundary.
