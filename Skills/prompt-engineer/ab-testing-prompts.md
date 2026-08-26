# A/B Testing Prompts

## Purpose
Compare prompt variants in production without confusing random variation, traffic mix, or novelty effects for real improvement.

## When to use
Use when offline evals cannot resolve a meaningful product trade-off and online outcomes are measurable safely.

## Inputs
Variants, hypothesis, primary metric, guardrails, traffic allocation, sample-size assumptions, and rollback criteria.

## Context to inspect
Inspect offline evals, user segments, baseline metric variance, model sampling settings, and concurrent experiments.

## Core knowledge
Online experiments measure product outcomes, not intrinsic prompt quality. Randomization, exposure logging, guardrails, and predeclared metrics reduce biased interpretation.

## Procedure
1. State one primary hypothesis and decision criterion.
2. Confirm both variants clear offline safety/quality gates.
3. Keep model/configuration identical unless intentionally testing the whole system.
4. Randomize at the correct unit to avoid cross-contamination.
5. Log variant exposure and relevant task slice.
6. Define primary metric, guardrails, and stopping conditions before launch.
7. Run long enough for required sample and temporal coverage.
8. Inspect segment-level harms without fishing for arbitrary wins.
9. Confirm practical as well as statistical significance.
10. Promote, reject, or iterate with a recorded decision.

## Decision points
Use offline evals for correctness regressions; online tests for user/product outcomes. Avoid experimentation when potential harm cannot be bounded.

## Common failure patterns
Peeking and stopping on a temporary win; changing variants mid-test; multiple uncorrected metrics; traffic imbalance; declaring a win despite safety/cost guardrail degradation.

## Verification
Exposure logs are complete, randomization is balanced, predefined metrics are analyzed, and rollout decision matches thresholds.

## Expected output
Experiment plan, results, guardrail analysis, and documented decision.

## Stop conditions
Stop immediately on safety/critical guardrail breach; do not launch without reliable exposure logging or rollback.