# Post-Training Evaluation

## Purpose
Build a decision-grade evaluation program that proves post-training improved intended behavior while exposing regressions, uncertainty, and slice-specific failures.

## When to use
Use before training to establish baselines, during checkpoint selection, after algorithm/data changes, and before release. Do not select a model from training objectives or one benchmark alone.

## Inputs
Behavior objectives, base and candidate checkpoints, automated evaluators, human-evaluation capacity, safety tests, product traffic distributions, and historical regressions.

## Preconditions
Evaluation data are isolated from training and tuning where practical, evaluator limitations are documented, and pass/fail gates are agreed before final checkpoint selection.

## Context to inspect
Review benchmark provenance, contamination risk, judge models/prompts, sampling parameters, variance, task slices, languages, safety categories, response lengths, and production constraints such as latency and cost.

## Core knowledge
Evaluation is multi-dimensional and noisy. Aggregate scores can hide tail failures and Simpson's paradox across slices. Model judges require calibration and can prefer verbosity or familiar model styles. Statistical uncertainty matters when candidate differences are small. Release decisions should combine target improvement, preservation, safety, calibration, and operational cost.

## Procedure
1. Map each post-training objective to at least one independent metric.
2. Establish reproducible base-model baselines with fixed harness versions.
3. Partition evaluations into target, preservation, safety, robustness, and operational suites.
4. Add high-impact slices by domain, difficulty, language, context length, and risk.
5. Use objective/verifiable scoring wherever possible.
6. Calibrate model judges against independent human labels for subjective tasks.
7. Randomize candidate order and blind model identity in pairwise comparisons.
8. Run enough samples or repeats to estimate uncertainty for important differences.
9. Compare every candidate to both the base and current production/reference model.
10. Investigate large slice regressions even when aggregate score improves.
11. Perform qualitative audits of extreme wins, losses, refusals, and high-risk failures.
12. Measure response tokens, latency-relevant behavior, tool calls, and other serving-cost proxies.
13. Freeze the evaluation harness used for the release decision and record versions.
14. Produce an explicit release recommendation with unresolved risks.

## Decision points
Use human evaluation when subjective distinctions are high impact or judge calibration is weak. Treat small score differences inside uncertainty as ties. Prefer Pareto-superior checkpoints; when trade-offs remain, require product/risk owners to approve the prioritization rather than hiding it in a composite score.

## Common failure patterns
Benchmark chasing; tuning on the test set; uncalibrated model judges; reporting only averages; changing evaluator prompts between candidates; ignoring uncertainty; failing to test benign behavior after safety tuning; selecting checkpoints by training loss or reward.

## Verification
Verify dataset isolation, harness reproducibility, evaluator calibration, sample counts, confidence intervals, slice coverage, and exact checkpoint identity. Re-run key gates from a clean environment before release.

## Expected output
A versioned evaluation report with baselines, candidate comparisons, statistical uncertainty, slice-level regressions, qualitative audits, operational metrics, and release recommendation.

## Stop conditions
Stop the release decision if evaluation contamination is material, evaluator reliability is insufficient for a critical objective, checkpoint identity is ambiguous, or a severe regression lacks an understood mitigation.