# Workflow: Measure → Optimize → Verify Cache Reuse

## Trigger
Low cache ratio, high cache-write/uncached tokens, provider/model migration, prompt-layout change, resume/fork/subagent rollout, or unexplained token-cost spike.

## Goal
Increase reusable-prefix efficiency without reducing correctness, security, or required context.

## Inputs
Representative benchmark tasks, trace JSONL, cache policy, provider capabilities, and task acceptance criteria.

## Baseline
Run at least `minimum_samples` unchanged tasks. Capture ordered prompt components, input/cached/cache-write tokens, latency, cost when available, and quality result.

## Context
Read `evidence/research.md`, `rules/cache-stability-rules.md`, and `skills/cache-boundary-analysis.md`.

## Stages
1. **Observe** — Cache Benchmark Agent collects baseline traces.
2. **Measure** — Run `scripts/cache_prefix_profiler.py` and store metrics.
3. **Diagnose** — Identify the earliest unstable component and classify whether instability is necessary, ordering-related, serialization-related, lineage-related, or compaction-related.
4. **Hypothesize** — Select exactly one change: deterministic sort, stable rendering, component relocation, stable lineage/key, or explicit breakpoint where supported.
5. **Implement** — Engineering owner applies only that change.
6. **Measure again** — Run the same representative tasks and profiler.
7. **Decision checkpoint** — If metrics do not improve materially, revert and try at most one additional hypothesis. If quality/security regress, revert immediately.
8. **Independent verification** — A non-implementing verifier checks required context, policy thresholds, and raw sample evidence.
9. **Complete** — Record Implemented, Measured, and Verified separately.

## Responsible agent
Cache Benchmark Agent measures; engineering owner changes prompt construction; independent verifier accepts/rejects.

## Tools
Profiler script, provider usage telemetry, deterministic diff/source tools, and existing benchmark/test suites.

## Outputs
Baseline report, hypothesis, candidate report, before/after comparison, verification verdict.

## Checkpoints
- Baseline sample count is sufficient.
- Earliest divergence has evidence.
- Only one causal variable changes per iteration.
- Required context remains present.
- Quality meets policy.

## Metrics
Cached ratio, cache-write ratio, uncached tokens/task, cost/task, latency distribution, component stability, and task quality.

## Retry policy
Maximum two optimization hypotheses. Do not retry provider failures blindly; classify transport/provider failures separately from cache behavior.

## Stop conditions
Stop on security/correctness regression, missing benchmark evidence, two unsuccessful hypotheses, or unsupported provider capability.

## Failure path
Revert candidate, preserve baseline evidence, record the failed hypothesis, and escalate unresolved provider/runtime behavior instead of weakening requirements.

## Verification
Verification requires representative repeated samples and an independent review of critical context preservation.

## Definition of Done
- Evidence documented.
- Baseline captured.
- Root cause supported by component fingerprints or provider telemetry.
- Improvement implemented.
- Before/after metrics complete.
- Quality/security regression absent.
- Independent verification passed.
- Remaining risks documented.
