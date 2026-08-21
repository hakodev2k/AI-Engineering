# Agent Prefix Cache Stability Profiler

**Category:** Performance

## Problem
Long-running and repetitive agents can lose prompt-cache reuse when supposedly stable instructions, tools, examples, or repository context change between calls. With GPT-5.6-era explicit cache writes, churn can affect both latency and cost.

## Evidence
See `evidence/research.md`. Current OpenAI guidance makes exact-prefix stability, cache-write accounting, and measured cache reuse production concerns; recent developer reports reinforce that cache behavior should be benchmarked rather than assumed.

## Existing approach and limitations
Teams commonly place static prompts first, use cache keys, and inspect aggregate token usage. These approaches do not attribute volatility to individual prefix sections and can hide nondeterministic tool/schema serialization.

## Proposed improvement
Fingerprint named reusable sections, measure volatility and provider cache metrics, change one evidence-backed cause at a time, and require an independent quality gate before accepting the optimization.

## Architecture
```text
agent-prefix-cache-stability-profiler/
├── README.md
├── evidence/research.md
├── config/cache-policy.json
├── scripts/prefix_stability.py
├── tests/test_prefix_stability.py
├── skills/cache-baseline-and-diagnosis.md
├── rules/cache-safe-optimization.md
└── workflows/measure-canonicalize-benchmark.md
```

## Installation
Requires Python 3.10+ and only the standard library.

## Trace format
One JSON object per line:
```json
{"task_id":"t1","variant":"baseline","prefix_sections":{"system":{"text":"fixed"},"tools":[{"name":"read"}]},"input_tokens":2000,"cached_tokens":1200,"cache_write_tokens":0,"latency_ms":110}
```
Do not put secrets or raw credentials in traces.

## Configuration
Edit `config/cache-policy.json`. `order_insensitive_sections` must remain empty unless the application contract proves order does not affect semantics.

## Usage
```bash
python scripts/prefix_stability.py traces.jsonl --policy config/cache-policy.json --quality-pass true --output report.json
python -m unittest tests/test_prefix_stability.py
```
Exit codes: `0` pass, `2` invalid input/configuration, `3` regression/gate failure.

## Workflow
Follow `workflows/measure-canonicalize-benchmark.md`: observe → baseline → diagnose → hypothesize → change → remeasure → independently verify quality. Maximum two failed hypotheses per run unless new evidence identifies a distinct cause.

## Metrics
Cache ratio, cache-write ratio, uncached input tokens/task, p50/p95 latency, stable-section change rate, and external quality/regression rate.

## Verification
**Implemented:** deterministic section fingerprinting, volatility analysis, baseline/candidate aggregation, percentile latency, policy gates, and tests.

**Measured:** only values produced from supplied traces are measurements; this package does not claim a universal performance gain.

**Verified:** completion requires the script gate plus the application's independent quality suite. Run the included tests to verify deterministic behavior and error handling.

## Safety
Never remove policy/security context for cacheability. Never reorder semantically ordered content. Redact secrets before telemetry capture. Provider behavior is treated as empirical evidence, not guaranteed from application-side hashes.

## Failure handling
Invalid traces block completion. A candidate regression restores the baseline layout. Two failed hypotheses stop the loop. Provider anomalies with stable prefixes are escalated rather than hidden by weakening quality gates.

## Definition of Done
Evidence documented; baseline captured; volatile section identified or provider anomaly isolated; candidate measured; existing quality tests pass; configured cache/latency gates pass; no required context removed; report is reproducible; no blocking issue remains.

## Customization
Add provider-specific cost calculations or exporters outside the core profiler while preserving the normalized trace contract and safety rules.
