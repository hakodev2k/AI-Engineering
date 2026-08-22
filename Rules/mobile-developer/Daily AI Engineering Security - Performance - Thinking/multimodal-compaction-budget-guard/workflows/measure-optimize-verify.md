# Workflow: Measure → Optimize → Verify

## Trigger
Multimodal history approaches compaction threshold, compaction has just run, or a fork/resume will reconstruct image-heavy history.

## Goal
Reduce token/byte pressure and repeated compaction while retaining evidence required for correctness.

## Inputs
History JSON, context window, trigger threshold, required headroom, image/byte budgets, protected evidence, task acceptance checks.

## Baseline
Run the budget analyzer before changes and record text estimate, image count, inline bytes, duplicate bytes, utilization, and projected headroom.

## Stages
1. **Observe** — capture baseline and compaction frequency/storage growth.
2. **Diagnose** — identify duplicate payloads, old superseded snapshots, and high-byte image groups.
3. **Hypothesize** — choose the smallest change: deduplicate first, then evict stale/unprotected images, then reduce older payload detail/reference representation.
4. **Optimize** — apply one bounded change set.
5. **Measure again** — rerun analyzer.
6. **Improved?** — if budget/headroom fail or quality regresses, re-evaluate once; maximum two attempts.
7. **Independent verify** — Context Budget Reviewer checks metrics and task acceptance criteria.

## Responsible agent
Context optimizer performs stages 1–6. Independent reviewer performs stage 7.

## Tools
History parser, digest analyzer, compaction implementation, deterministic budget script, task tests/evals.

## Outputs
Before/after reports, chosen retain/evict actions, quality evidence, verification decision.

## Checkpoints
Baseline exists; protected evidence labeled; duplicate-first optimization attempted; required headroom met; task acceptance passes.

## Metrics
Input tokens, estimated image tokens, image count, inline bytes, duplicate bytes, context utilization, headroom, compactions/10 turns, rollout growth/turn, request failures, quality regression.

## Retry policy
Maximum two optimization attempts. Retry must change the hypothesis, not just repeat compaction.

## Stop conditions
Verified budget and quality; protected evidence cannot fit; request reconstruction remains oversized after two attempts; or quality regresses after two attempts.

## Failure path
Preserve required evidence, report the blocking dimension, stop automatic retries, and escalate for a larger-context/model/storage architecture decision.

## Verification
Reviewer must reproduce budget results and confirm acceptance quality. Implemented and Measured do not imply Verified.

## Definition of Done
Baseline captured; duplicate/stale causes identified; optimized history meets all configured dimensions and headroom; no critical evidence lost; acceptance tests pass; reviewer returns VERIFIED.