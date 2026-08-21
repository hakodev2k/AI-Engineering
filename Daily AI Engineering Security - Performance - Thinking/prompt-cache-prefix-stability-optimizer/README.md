# Prompt Cache Prefix Stability Optimizer

**Category:** Token  
**Run date:** 2026-08-21 (Vietnam, UTC+7)

## Problem
Large agent prompts may be mostly reusable yet still achieve poor prompt-cache reuse when volatile fields appear before stable instructions, tool schemas, examples or repository context. Exact-prefix caching stops at the first divergence, increasing uncached tokens, latency and cost.

## Evidence
See `evidence/research.md`. Current OpenAI agent guidance emphasizes exact prefix matching and stable-first prompt layout; 2026 production measurements and research show that dynamic prefix fields and query-aware compression can substantially reduce cache reuse.

## Existing approach and limitation
Simply enabling provider caching, placing a system message first, or adding a cache key does not guarantee a stable rendered prefix. Tool ordering, dynamic metadata, retrieval, compression and serialization can introduce earlier differences. Aggregate spend also hides the precise segment responsible for misses.

## Proposed improvement
Profile the actual rendered request as ordered segments, measure provider cached-token telemetry, hash expected-stable segments, locate the earliest divergence, then make one evidence-driven structural change. Re-measure cache ratio, latency/cost and quality before accepting the optimization.

## Architecture
- `evidence/research.md` — public evidence, current approaches, gap and root causes.
- `config/thresholds.json` — cache, quality, latency and sampling gates.
- `skills/cache-prefix-diagnosis.md` — reusable diagnosis procedure.
- `rules/prefix-stability.md` — enforceable token/cache rules.
- `subagents/cache-verifier.md` — independent verifier.
- `workflows/profile-optimize-verify.md` — bounded measure/diagnose/change/re-measure workflow.
- `hooks/pre-release-cache-regression.md` — blocking pre-release comparison hook.
- `scripts/cache_profiler.py` — JSONL profiler for cache telemetry and segment stability.
- `tests/test_cache_profiler.py` — profiler and regression-gate tests.

## Installation
Python 3.10+. For tests:

```bash
python -m pip install pytest
```

No provider SDK is required because the profiler consumes exported sanitized telemetry.

## Input format
Each JSONL row contains ordered rendered segments and observed usage:

```json
{"segments":[{"name":"system","content":"...","expected_stable":true},{"name":"request","content":"...","expected_stable":false}],"input_tokens":10000,"cached_tokens":7000,"latency_ms":900,"cost_usd":0.02,"quality_ok":true}
```

The script hashes segment content in memory and never emits raw content. Redact sensitive values before producing the JSONL file.

## Usage
Profile a baseline:

```bash
python scripts/cache_profiler.py baseline.jsonl --thresholds config/thresholds.json
```

Compare a candidate and fail on regression:

```bash
python scripts/cache_profiler.py baseline.jsonl --candidate candidate.jsonl --thresholds config/thresholds.json --strict
```

Run tests:

```bash
pytest -q tests/test_cache_profiler.py
```

Exit codes: `0` success/pass, `2` invalid input/configuration, `3` strict threshold failure.

## Workflow
Observe actual rendered requests → measure baseline → locate first divergence and unstable expected-stable segments → form one hypothesis → canonicalize/reorder without dropping required context → collect comparable candidate samples → compare cached ratio, latency/cost and quality → independent verification. Maximum 3 optimization cycles.

## Metrics
- Mean/median cached-input ratio.
- First divergent segment.
- Expected-stable hash variants.
- Latency/task and cost/task when telemetry is supplied.
- Quality/success rate and regression.

## Verification
### Implemented
Profiler, tests, thresholds, rules, hook, diagnosis skill, bounded workflow and independent verifier are included.

### Measured
A deployment is measured after baseline and candidate cohorts are captured using provider usage telemetry.

### Verified
A change is verified only when the independent verifier confirms comparable sampling, acceptable cache reuse, no quality regression beyond policy, and preservation of required context. File generation alone is not proof of production improvement.

## Safety
Do not persist raw secrets or sensitive retrieved content in profiling datasets. Do not remove authorization, policy, user-intent, safety, or correctness context to increase cache hits. Cache optimization is subordinate to correctness and security.

## Failure handling
Detection: strict profiler failure or quality regression. Evidence: comparison report plus segment hashes. Retry: max 3 distinct hypotheses. Fallback: revert to the prior prompt layout. Escalation: architecture/provider review. Stop if cache telemetry is unavailable for a provider where a hit cannot be reliably inferred, or if improvement requires critical-context removal.

## Definition of Done
Current evidence documented; baseline captured; first divergence/root cause identified; candidate implemented; comparable candidate cohort captured; cache ratio/cost/latency measured; task quality remains within tolerance; required context preserved; independent verifier returns `verified`; no blocking issue remains.

## Customization
Adjust thresholds per workload economics and quality sensitivity. Extend segment naming to tool schemas, policy blocks, examples, repository summaries, memory and retrieved documents. If your provider exposes additional fields such as prompt-cache keys or cache-write tokens, add them as measurements without replacing the exact-prefix stability checks.