# Agent Session-Aware KV Retention Profiler

**Category:** Performance  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Long-running agents replay large shared prefixes across turns. Generic KV/prefix-cache replacement does not know whether an idle agent is waiting briefly and likely to resume or whether a branch is finished. Evicting the former causes costly re-prefill; retaining the latter wastes scarce cache capacity.

## Evidence
See `evidence/research.md`. Current signals include vLLM's 2026 agentic-serving trace study, the open session-aware KV hint RFC #52113, recent selective-retention work, long-context DCP results, and Anthropic's Claude Code prompt-cache engineering guidance.

## Existing approach
Automatic Prefix Caching, distributed KV stores, retention intervals/selective retention, DCP and stable prompt-prefix design already reduce repeated compute.

## Existing limitations
Lifecycle semantics live in the orchestrator while cache pressure lives in the inference engine. Aggregate hit rate can conceal expensive misses at wait/resume boundaries, and aggressive retention can itself reduce capacity.

## Proposed improvement
A provider-neutral measurement and regression package that correlates session lifecycle with reused-prefix tokens and TTFT, ranks resume misses by avoidable prefill, and requires comparable before/after traces before accepting bounded retention changes.

## Architecture / package tree
- `evidence/research.md` — evidence, current approaches and root cause.
- `rules/performance-evidence.md` — measurable optimization invariants.
- `skills/profile-session-cache-reuse.md` — investigation procedure.
- `subagents/cache-benchmark-verifier.md` — independent verifier.
- `workflows/measure-diagnose-optimize.md` — bounded Measure→Diagnose→Hypothesize→Optimize→Measure flow.
- `hooks/cache-regression-gate.md` — rollout-blocking p95 TTFT gate.
- `scripts/profile_cache.py` — dependency-free trace profiler/comparator.
- `tests/test_profile_cache.py` — deterministic unit tests.

## Installation
Python 3.9+, standard library only.

## Configuration
Instrument each turn as JSONL with `session_id`, `turn`, `input_tokens`, `reused_prefix_tokens`, `ttft_ms`; add `event` values such as `wait`, `resume`, `complete` when available. Preserve tenant/cache-salt isolation.

## Usage
Baseline:
`python scripts/profile_cache.py baseline.jsonl --out baseline-report.json`

Candidate/regression gate:
`python scripts/profile_cache.py candidate.jsonl --baseline baseline.jsonl --max-p95-regression-pct 5 --out comparison.json`

## Workflow
Follow `workflows/measure-diagnose-optimize.md`. Only one cache-policy hypothesis changes per attempt; at most two attempts are permitted. Examples include bounded protect TTL, offload-on-wait, prefetch-before-resume, or release-on-complete when supported by the serving stack.

## Metrics
Reused-prefix ratio; median/p95 TTFT; resume miss rate; resume avoidable-prefill tokens; plus platform throughput/cache occupancy when available.

## Verification
Run `python -m unittest tests/test_profile_cache.py`. The Cache Benchmark Verifier must check workload comparability and reproduce the report. A candidate cannot be called faster solely because reuse improved; latency/regression evidence is mandatory.

## Safety
Do not share KV cache across tenants/trust groups to improve hit rate. Do not change model input semantics. Do not retain completed branches indefinitely. Published performance numbers in research are evidence of the problem/opportunity, not promises for a downstream deployment.

## Failure handling
Detection: malformed/incomplete trace, p95 regression, non-comparable workload or capacity/security regression. Evidence: trace and report. Retry: maximum two hypotheses. Fallback: revert to baseline cache policy. Escalation: inference/platform owner. Stop: two failed attempts or required security-boundary weakening.

## Status semantics
- **Implemented:** profiler, tests, workflow and gate exist.
- **Measured:** representative baseline/candidate traces were collected in the target environment.
- **Verified:** independent before/after comparison satisfies acceptance thresholds with no blocking regression.

This package is Implemented; environment-specific optimization remains Measured/Verified only after real traces are supplied.

## Definition of Done
Current evidence documented; baseline captured; root cause linked to lifecycle/cache observations; bounded candidate implemented; comparable workload remeasured; target metric improves; p95 gate passes; security isolation preserved; independent verification complete.

## Customization
Add provider-specific fields to traces, but keep required fields stable. Extend the regression gate with throughput or cache-occupancy limits when those metrics are available from the serving platform.
