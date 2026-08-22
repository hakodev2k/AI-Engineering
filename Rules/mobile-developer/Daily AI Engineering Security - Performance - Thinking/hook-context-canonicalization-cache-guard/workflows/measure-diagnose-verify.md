# Workflow — Measure, Diagnose, Verify Cache Stability

## Trigger
Hook rollout, runtime upgrade, resume/cache regression, or rewrite-ratio alert.

## Goal
Reduce avoidable cache creation while preserving required context and task quality.

## Inputs
Baseline/candidate traces, `config/cache-policy.json`, hook configuration, runtime/model versions, quality fixtures.

## Baseline
Run the same representative task at least three times under a known-stable configuration. Record cache read/create tokens, latency, total tokens, and quality results.

## Stages
1. **Observe** — Cache Investigator validates trace completeness and labels model/version/hook/compaction events.
2. **Measure** — Run `scripts/cache_trace_analyzer.py` against baseline and candidate traces.
3. **Diagnose** — Compare invalidation boundaries; exclude TTL, model, tool-list, compaction and intentional changes.
4. **Hypothesize** — Rank representation drift, volatile stable-prefix fields, and unrelated client reconstruction as hypotheses.
5. **Implement** — Canonicalize reusable hook context or relocate only genuinely volatile data to a non-reusable suffix.
6. **Measure again** — Repeat the original fixture three times.
7. **Verify** — Independent verifier confirms policy thresholds and quality tests.

## Checkpoints
- Baseline evidence exists before modification.
- Root-cause hypothesis cites a concrete invalidation boundary.
- No security/correctness context was removed.
- Before/after workload and model are comparable.

## Metrics
Cache-creation tokens/task, rewrite ratio, cache-read tokens/task, total tokens/task, latency/task, quality regression rate.

## Retry policy
At most 3 diagnosis/implementation cycles. Each retry MUST introduce a new evidence-backed hypothesis.

## Stop conditions
Stop on quality regression, missing evidence, inability to reproduce, or three unsuccessful cycles.

## Failure path
Restore original hook semantics, retain diagnostic evidence, classify the result as not verified, and escalate to runtime/provider investigation.

## Verification
Regression hook passes, analyzer exits 0, three repeated candidate traces meet thresholds, quality fixtures pass.

## Definition of Done
Implemented, measured, and verified are separately recorded; token improvement is measurable; no required context is lost; no blocking regression remains.
