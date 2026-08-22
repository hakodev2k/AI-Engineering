# Prefix Cache Gap-Aware Context Stabilizer

**Category:** Performance / Token

## Problem
Long-running agents repeatedly resend large stable prefixes. Provider prompt caching usually helps, but idle gaps and application prefix churn can still force expensive fresh prefill, increasing TTFT, token cost, and latency.

## Evidence
Current evidence is documented in `evidence/research.md`. The package is grounded in 2026 TraceLab coding-agent traces plus current OpenAI and Anthropic prompt-caching guidance.

## Existing approach
Provider-native prefix caching, prompt compaction, and manual usage inspection.

## Existing limitations
Aggregate hit rate hides expensive large misses; idle eviction and application churn are often conflated; prompt shortening can damage correctness; nondeterministic gateway/prompt construction can invalidate reusable prefixes.

## Proposed improvement
Measure per-step cached/input tokens, idle gaps, TTFT, and stable-prefix fingerprints; classify the dominant miss source; stabilize only avoidable churn; compare a candidate against an unchanged baseline; block Verified status when quality regresses.

## Architecture
```text
prefix-cache-gap-aware-context-stabilizer/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── cache-regression-gate.md
├── rules/
│   └── prefix-cache-rules.md
├── scripts/
│   └── analyze_prefix_cache.py
├── skills/
│   └── cache-gap-analysis.md
├── subagents/
│   └── cache-performance-reviewer.md
├── tests/
│   └── test_analyze_prefix_cache.py
└── workflows/
    └── measure-optimize-verify.md
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Edit `config/policy.json` for gap buckets, minimum analyzed input size, warning thresholds, and allowed performance regression.

## Usage
Provide JSONL telemetry with `ts_ms`, `input_tokens`, and `cached_tokens`; optionally add `trigger`, `prefix_fingerprint`, and `ttft_ms`.

```bash
python3 scripts/analyze_prefix_cache.py telemetry.jsonl --policy config/policy.json
python3 -m unittest tests/test_analyze_prefix_cache.py
```

Use `--strict` when analyzer warnings should fail CI.

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement one bounded change → Measure again → Independent verification.

## Metrics
- weighted cache hit rate
- uncached tokens/task
- prefix fingerprint churn rate
- miss cost by idle-gap bucket
- p50/p95 TTFT when supplied
- cost/task in the host platform
- task-quality regression rate

## Verification
**Implemented** means instrumentation or prompt-layout changes exist. **Measured** means comparable baseline and candidate telemetry exists. **Verified** requires a measured improvement within policy plus passing task-quality regression fixtures and independent review.

## Safety
Never remove security, authorization, policy, or correctness-critical context for cache savings. Prefer non-sensitive fingerprints over storing prompt bodies. Never claim provider retention guarantees beyond documented behavior.

## Failure handling
Invalid or insufficient telemetry blocks root-cause claims. Missing fingerprints means churn cannot be proven. Missing TTFT allows token analysis only. Optimization retries are capped at two per diagnosis; failed candidates should be reverted or re-diagnosed.

## Definition of Done
- current evidence documented
- baseline captured
- dominant miss class identified
- candidate change implemented
- before/after metrics collected
- analyzer tests pass
- task-quality fixtures pass
- independent reviewer approves
- risks documented
- no blocking policy violation remains

## Customization
Adapt telemetry exporters to provider-specific usage fields, add gateway fingerprints, extend gap buckets, and integrate the regression hook with the repository's existing eval system.
