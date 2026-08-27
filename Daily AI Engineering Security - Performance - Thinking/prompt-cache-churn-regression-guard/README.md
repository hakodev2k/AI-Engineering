# Prompt Cache Churn Regression Guard

**Category:** Token

## Problem
Long-lived AI coding and agent sessions can unexpectedly lose prompt-cache reuse and rewrite very large stable prefixes, multiplying token cost and latency even when the workload is mostly unchanged.

## Evidence
See `evidence/research.md` for August 2026 public reports of repeated cache drops and large redundant cache writes.

## Existing approach
Provider cache controls, longer TTLs, cache-friendly prompt ordering, manual usage inspection, session restarts, and context reduction can help.

## Existing limitations
TTL settings do not detect unexpected invalidation inside the TTL. Aggregate token totals hide per-turn churn. Long contexts and tool/system-prefix growth make misses expensive. Context reduction can damage correctness if it is not quality-tested.

## Proposed improvement
Capture per-turn usage, establish a healthy baseline, detect cache-read collapses and oversized cache rewrites, correlate with stable-prefix fingerprints, and fail regression checks when churn exceeds deterministic policy.

## Architecture
```text
prompt-cache-churn-regression-guard/
├── README.md
├── evidence/research.md
├── skills/cache-churn-analysis.md
├── rules/token-cache-rules.md
├── subagents/cache-verifier.md
├── workflows/measure-diagnose-optimize.md
├── hooks/post-session-cache-check.md
├── scripts/cache_churn_guard.py
└── tests/test_cache_churn_guard.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Default thresholds are defined in `scripts/cache_churn_guard.py`: large-context floor 100k tokens, expected cache-read ratio 0.70, maximum cache-creation ratio 0.20, maximum one consecutive churn event, and maximum three prefix changes over the last 20 requests. Fork the package to change thresholds for a measured workload.

## Usage
Input is JSONL with one record per model request and fields: `request_id`, `input_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`, `latency_ms`, `prefix_fingerprint`.

Run:
`python scripts/cache_churn_guard.py trace.jsonl`

## Workflow
Use `workflows/measure-diagnose-optimize.md`: Observe → Measure baseline → Diagnose → Hypothesize → Make one reversible change → Measure again → independently verify. Maximum two optimization hypotheses.

## Metrics
Cache read ratio, cache creation ratio, rewritten tokens, p50/p95 latency, consecutive churn events, stable-prefix fingerprint changes, task quality/regression rate.

## Verification
Run:
`python -m unittest tests/test_cache_churn_guard.py`

The verifier must also confirm task-quality tests remain equal or better; lower token use alone is insufficient.

## Safety
The analyzer needs usage metadata and prefix fingerprints only. Do not log prompts, secrets, credentials, or private retrieved content. Required correctness context MUST NOT be removed solely to improve cache metrics.

## Failure handling
Detection uses meaningful exit codes: 0 pass, 2 invalid telemetry, 3 measured policy breach. Retry instrumentation once if fields are missing and optimization at most twice. Fallback is to preserve correctness/context and revert the candidate change.

## Definition of Done
**Implemented:** telemetry and guard integrated.  
**Measured:** baseline and candidate traces captured.  
**Verified:** unit tests pass, cache churn is within policy, before/after metrics are recorded, and quality/context regression checks remain green.

## Customization
Adjust thresholds only from workload evidence. Add provider-specific adapters outside the deterministic core rather than embedding provider credentials or raw prompts.
