# Stable Prefix Cache Boundary Profiler

## Topic
Measure and improve prompt-cache reuse in AI agents by identifying the earliest unstable prompt component and validating cache-boundary changes with before/after evidence.

## Category
Token

## Problem
Agent prompts frequently contain large reusable prefixes but still incur repeated uncached or cache-write tokens because rendering order changes, volatile values appear too early, compaction rewrites history, cache lineage changes across resumes/subagents, or a client cannot place an explicit cache boundary where the prefix is actually stable.

## Evidence
See `evidence/research.md`. Current evidence includes OpenAI's GPT-5.6 explicit caching guidance and independent reports from Codex, Claude Code, and browser-use showing cache misses caused by missing boundary support, non-deterministic prompt construction, context mutation, and lost lineage.

## Existing approach
Provider-managed caching, explicit breakpoints where supported, stable cache keys, context compaction, and ad hoc prompt ordering.

## Existing limitations
Caching can be enabled while still being ineffective. Semantic stability is insufficient when rendered prefixes differ. Request-level token totals also do not identify which prompt component first invalidated reuse.

## Proposed improvement
Represent each rendered prompt as ordered named components, fingerprint those components across comparable requests, locate the first divergence, correlate it with cache read/write metrics, change one causal variable at a time, and accept only improvements that preserve quality and required context.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `config/cache-policy.json` — measurable thresholds and provider capabilities.
- `skills/cache-boundary-analysis.md` — reusable diagnosis procedure.
- `rules/cache-stability-rules.md` — enforceable cache/correctness rules.
- `subagents/cache-benchmark-agent.md` — specialized measurement role.
- `workflows/measure-optimize-verify.md` — bounded optimization workflow.
- `hooks/preflight-cache-budget.md` — deterministic completion gate.
- `scripts/cache_prefix_profiler.py` — local JSONL component/cache profiler.
- `tests/test_cache_prefix_profiler.py` — deterministic regression tests.

## Actual package tree
```text
stable-prefix-cache-boundary-profiler/
├── README.md
├── config/
│   └── cache-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── preflight-cache-budget.md
├── rules/
│   └── cache-stability-rules.md
├── scripts/
│   └── cache_prefix_profiler.py
├── skills/
│   └── cache-boundary-analysis.md
├── subagents/
│   └── cache-benchmark-agent.md
├── tests/
│   └── test_cache_prefix_profiler.py
└── workflows/
    └── measure-optimize-verify.md
```

## Installation
Requires Python 3.10+ for the profiler. The tests use `pytest`.

```bash
python --version
python -m pip install pytest
```

No provider SDK is required because the profiler consumes exported local JSONL traces.

## Configuration
Edit `config/cache-policy.json` for your workload. Set provider capability flags only after confirming support from the provider/model documentation. Do not enable explicit breakpoint behavior based on model-name guessing alone.

## Trace format
One JSON object per line:

```json
{"request_id":"r1","prefix_parts":[{"name":"system-policy","content":"..."},{"name":"tools","content":["..."]},{"name":"user-turn","content":"..."}],"input_tokens":10000,"cached_tokens":8000,"cache_write_tokens":1000,"latency_ms":1200,"cost":0.02,"quality_pass":true}
```

`prefix_parts` is mandatory and ordered. Usage/cost/latency/quality fields are optional unless required by policy.

## Usage
Profile a baseline:

```bash
python scripts/cache_prefix_profiler.py baseline.jsonl --policy config/cache-policy.json
```

Use as a blocking gate:

```bash
python scripts/cache_prefix_profiler.py candidate.jsonl --policy config/cache-policy.json --strict
```

Write machine-readable output:

```bash
python scripts/cache_prefix_profiler.py candidate.jsonl --policy config/cache-policy.json --output report.json
```

Run tests:

```bash
pytest -q tests/test_cache_prefix_profiler.py
```

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose earliest divergence → Form one hypothesis → Implement → Measure again → bounded retry if needed → independent verification.

## Metrics
Primary metrics are cached/input ratio, cache-write/input ratio, uncached tokens per completed task, cost/task, p50/p95 latency, stable-prefix bytes/components, earliest unstable component, and quality pass rate.

## Verification
### Implemented
A candidate prompt-layout/cache change exists and trace capture identifies ordered prompt components.

### Measured
At least the configured minimum number of comparable baseline and candidate samples have been profiled.

### Verified
The independent verifier confirms required context remains present, quality passes, policy thresholds are met, and the improvement is supported by repeated evidence rather than a single warm cache hit.

## Safety
- Never remove authorization, security, or task-critical context solely for cache efficiency.
- Never place secrets in cache keys or trace fixtures.
- Sanitize production trace content before sharing; the profiler needs component stability, not secret values.
- Treat provider caching as best-effort unless the provider explicitly guarantees otherwise.

## Failure handling
Detection is via profiler input errors, policy failures, quality regressions, or missing provider telemetry. Invalid inputs exit 2; strict policy violations exit 3. Retry at most two distinct optimization hypotheses. Revert on correctness/security regression. If provider behavior remains unexplained, preserve evidence and escalate rather than lowering quality requirements.

## Definition of Done
- `evidence/research.md` documents current evidence, existing approaches, limitations, and root causes.
- Baseline traces meet minimum sample count.
- Earliest unstable component is measured.
- A single causal improvement is implemented.
- Before/after cache, latency, cost, and quality metrics are collected when available.
- Tests pass.
- Critical context is unchanged in effectiveness.
- Independent verification passes.
- No blocking issue remains.

## Customization
Add provider-specific trace adapters outside the core profiler, but keep the profiler input schema provider-neutral. Add workload-specific quality fields to your benchmark harness while preserving the `quality_pass` boolean used by the gate.
