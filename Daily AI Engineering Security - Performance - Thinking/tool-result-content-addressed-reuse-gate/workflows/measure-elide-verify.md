# Workflow: Measure, Elide, Verify

## Trigger
Repeated successful read-only tool results materially contribute to prompt size, cache-read volume, context pressure, compaction frequency, cost, or latency.

## Goal
Reduce duplicate model-visible tool-result payload while preserving fresh tool execution and task quality.

## Inputs
Representative session traces, tool annotations, tool results, context lifecycle events, token/cost telemetry, quality checks, and `config/policy.json`.

## Baseline
Record per-task input tokens, repeated-result bytes/tokens, number of tool executions, repeated identities, compactions, latency, cost, and task quality before enabling reuse.

## Context
Read `evidence/research.md`, `skills/content-addressed-tool-result-reuse.md`, and `rules/tool-result-reuse-rules.md`.

## Stages
1. **Observe** — identify repeated successful read-only result identities.
2. **Measure baseline** — quantify duplication and downstream compaction/cost.
3. **Diagnose** — separate repeated execution from repeated model payload; map context-epoch changes.
4. **Form hypothesis** — estimate savings from safe full-payload/marker substitution.
5. **Implement** — integrate fresh execution + hash + visibility-lease gate.
6. **Measure again** — replay the same workload and capture identical metrics.
7. **Stress context lifecycle** — force/fixture compaction or epoch change and verify one full reinjection occurs.
8. **Independent verify** — Token Regression Verifier checks execution parity and quality.
9. **Complete** — accept only evidence-backed improvement.

## Responsible agent
Implementation owner for stages 1–7; `subagents/token-regression-verifier.md` for stage 8.

## Tools
Trace parser, token estimator/provider usage metrics, `scripts/tool_result_reuse_gate.py`, `tests/test_tool_result_reuse_gate.py`, and representative workload harness.

## Outputs
Baseline/post-change metrics, result-identity telemetry, visibility-epoch evidence, quality results, and verifier status.

## Checkpoints
- A: duplication is measurable and material.
- B: candidate tools are explicitly read-only.
- C: context lifecycle has an observable epoch/invalidation signal.
- D: changed/error/non-read-only outputs remain full.
- E: post-compaction reinjection works.
- F: independent verification passes.

## Metrics
Tokens/task, repeated-result bytes, emitted bytes, saved bytes, tool executions, reuse hit rate, compaction count, latency/task, cost/task, task quality, regression rate, and false-elision count.

## Retry policy
Maximum two diagnose/optimize/remeasure cycles. Do not increase savings by weakening visibility or correctness rules.

## Stop conditions
Stop and revert/elide-disable when task quality regresses, a stale/false marker appears, fresh tool execution is skipped, context visibility cannot be proven, or measured savings are negligible.

## Failure path
Emit full fresh results, retain telemetry, document the failed assumption, and escalate if the runtime lacks a trustworthy context lifecycle signal.

## Verification
The same workload must show lower repeated-result token/byte volume with equal tool execution count and equivalent quality. Context epoch change must force full reinjection.

## Definition of Done
Evidence documented; baseline measured; eligibility configured; implementation integrated; tests pass; before/after comparison shows improvement; no critical context loss; no false elision; verifier marks `verified`; risks documented; no blocking issue remains.