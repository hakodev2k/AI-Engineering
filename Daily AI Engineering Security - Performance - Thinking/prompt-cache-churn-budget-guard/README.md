# Prompt Cache Churn Budget Guard

**Category:** Token

## Problem
Large-context agent sessions can suddenly lose prompt-cache reuse and keep re-sending or re-writing huge contexts, multiplying token cost and latency while making little additional task progress.

## Evidence
Current evidence is documented in `evidence/research.md`, including August 2026 Claude Code and Codex reports plus provider documentation on cache behavior.

## Existing approach
Provider prompt caching, stable prefixes, compaction/truncation, summaries, retrieval and usage dashboards.

## Existing limitations
Cache continuity is often opaque; aggregate usage arrives too late; intentional invalidation is hard to distinguish from pathological churn; repeated wait/status turns can still trigger expensive full-context model calls.

## Proposed improvement
A provider-agnostic runtime guard that treats cache continuity and no-progress large-context turns as measurable budgets. It detects unexplained same-prefix cache collapse and stops repeated expensive no-op continuation before cost compounds.

## Architecture
```text
prompt-cache-churn-budget-guard/
├── README.md
├── evidence/research.md
├── config/policy.json
├── skills/cache-churn-analysis.md
├── rules/token-cache-budget.md
├── subagents/cache-verifier.md
├── workflows/measure-optimize-verify.md
├── hooks/post-model-turn.md
├── scripts/cache_churn_guard.py
└── tests/test_cache_churn_guard.py
```

## Installation
Python 3.10+ only; no third-party packages.

## Configuration
Adjust thresholds in `config/policy.json` only after collecting a workload baseline. `prefix_id` should fingerprint the cache-critical stable prefix without logging raw prompt contents.

## Usage
Telemetry is JSONL, one object per model turn. Required fields: `input_tokens`, `cached_tokens`, `latency_ms`, `semantic_progress`. Large-context rows also require `prefix_id` by default. Mark known deliberate invalidations with `expected_cache_invalidation: true`.

Run:
```bash
python scripts/cache_churn_guard.py --telemetry session.jsonl --policy config/policy.json
python -m unittest tests/test_cache_churn_guard.py
```

Exit 0 = pass; exit 2 = invalid input/configuration; exit 3 = runtime budget exceeded.

## Workflow
Observe → measure baseline → diagnose cache discontinuity → form one hypothesis → optimize → measure again → bounded retry if needed → independent verification.

## Metrics
Cached-token ratio, total input tokens/task, cache-write tokens where available, latency p50/p95, expensive no-op streak, result quality and regression rate.

## Verification
The package is complete only when unit tests pass, representative before/after telemetry is collected, unexplained churn is within policy, and the Cache Verifier confirms no correctness-critical context was removed.

## Safety
Never remove required context purely for savings. Do not log raw secrets or unnecessary private prompt content. A failed guard blocks unattended continuation rather than weakening quality or policy.

## Failure handling
Detection: guard exit 3. Evidence: telemetry and change diff. Retry: maximum two optimization attempts. Fallback: restore previous context strategy. Escalation: runtime/provider owner. Stop: correctness regression, missing required telemetry, or exhausted retries.

## Definition of Done
- **Implemented:** telemetry, hook, policy and guard integrated.
- **Measured:** before/after token, cache and latency metrics captured.
- **Verified:** tests pass, quality is equal or better, unexplained churn is within budget, no critical context is lost.

## Customization
Provider-specific adapters may add cache-write tokens, pricing or retention metadata, but the core input format should remain provider-neutral.
