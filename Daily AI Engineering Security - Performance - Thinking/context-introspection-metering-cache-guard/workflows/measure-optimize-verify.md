# Workflow: Measure → Optimize → Verify Introspection

## Trigger
Unexpected provider spend, per-turn context polling, large tool catalogs, SDK upgrade, or auxiliary-call telemetry investigation.

## Goal
Reduce hidden introspection request/token overhead while preserving context-pressure correctness.

## Inputs
Baseline JSONL trace, provider/model, cache policy candidate, optional provider billing totals.

## Baseline
Capture representative tasks before changing caching, polling, or counting behavior.

## Context
Use `rules/introspection-budget.md` and `skills/measure-and-cache-introspection.md`.

## Stages
1. **Observe** — capture all auxiliary context/token-count calls.
2. **Measure baseline** — run analyzer for request, token, latency, cost, cache, and repeated-fingerprint metrics.
3. **Diagnose** — locate repeated unchanged fingerprints and telemetry gaps.
4. **Form hypothesis** — define cache key, invalidation conditions, and refresh trigger.
5. **Implement improvement** — cache stable counts and shift refresh from render/turn polling toward context-definition changes where possible.
6. **Measure again** — replay the same workload.
7. **Improved?** — require fewer auxiliary requests/tokens or lower cost/latency. If no, revise at most twice.
8. **Regression verification** — confirm changed fingerprints invalidate and context-limit behavior remains correct.
9. **Independent verification** — Token Verifier reviews both traces and provider reconciliation.

## Responsible agent
Token/performance implementer for stages 1–8; `subagents/token-verifier.md` for independent verification.

## Tools
`python scripts/introspection_analyzer.py`, deterministic unit tests, provider invocation/billing exports where available.

## Outputs
Before/after reports, cache policy, regression status, independent verdict.

## Checkpoints
After baseline, after cache implementation, after benchmark replay, before completion.

## Metrics
Auxiliary requests/turn, input tokens/turn, cost/task, latency, cache hit rate, repeated fingerprint calls, provider/local delta, context correctness.

## Retry policy
Maximum 2 optimization retries; each retry requires a changed evidence-backed hypothesis.

## Stop conditions
Stop on missing baseline, malformed traces, stale-cache correctness failure, unexplained provider/local gap, or exhausted retries.

## Failure path
Restore prior behavior, retain instrumentation, use last-known-good counts only when safe, and escalate adapter/provider behavior for investigation.

## Verification
Optimized trace must improve at least one primary cost/latency metric without increasing context-overflow or task-quality regressions.

## Definition of Done
Implemented: cache/metering policy active. Measured: comparable before/after traces captured. Verified: measurable reduction, correct invalidation, reconciled telemetry, regression tests pass, independent verifier approves.