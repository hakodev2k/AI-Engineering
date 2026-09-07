# Reward Model Training

## Purpose
Train and validate a reward or preference model that scores candidate behavior accurately enough to guide policy optimization without becoming an exploitable proxy.

## When to use
Use when RLHF or large-scale candidate ranking requires a learned reward. Do not add a reward model when direct preference optimization or verifiable task rewards satisfy the objective with less complexity.

## Inputs
Preference dataset, base encoder/model, reward architecture, evaluation holdouts, slice definitions, compute budget, and policy-generation samples.

## Preconditions
Preference labels have passed quality audits, train/evaluation data are separated, and target reward semantics are documented.

## Context to inspect
Inspect label imbalance, prompt and response lengths, candidate source models, duplicated prompts, rater disagreement, reward ranges, and intended policy-optimization algorithm.

## Core knowledge
Reward models approximate human preferences only within their training distribution. High ranking accuracy can coexist with harmful calibration or exploitable extrapolation. Reward scale, response length, style artifacts, and policy distribution shift matter during RL. Evaluation must include adversarial and out-of-distribution candidates, not only random held-out pairs.

## Procedure
1. Establish pairwise ranking and calibration baselines.
2. Validate preprocessing, templates, truncation, and reward head initialization.
3. Split data by prompt or semantic cluster to prevent leakage across candidate pairs.
4. Train conservative baselines before increasing model capacity.
5. Track ranking accuracy, margins, calibration, and slice-level performance.
6. Analyze reward correlations with length, verbosity, formatting, and candidate source.
7. Test adversarial candidates designed to exploit superficial cues.
8. Score samples from the intended policy throughout development to detect distribution shift.
9. Compare multiple checkpoints on independently labeled examples.
10. Inspect high-reward false positives manually.
11. Set reward clipping, normalization, or uncertainty handling for downstream optimization when needed.
12. Document unsupported regions where reward scores should not be trusted.

## Decision points
Choose a larger reward model only when smaller models fail on consequential distinctions. Use ensembles or uncertainty estimates for high-risk optimization when single-model confidence is unreliable. Prefer explicit verifiers over learned reward components for objectively checkable subgoals.

## Common failure patterns
Prompt leakage between train and test; selecting by aggregate accuracy; reward-length bias; overconfident extrapolation; using stale reward models after policy distribution changes; ignoring ties; reward scale drift across checkpoints.

## Verification
Verify pairwise performance, calibration, bias correlations, adversarial robustness, policy-distribution performance, and manual audits of reward extremes. Confirm the reward signal predicts independent human preference better than simple heuristics.

## Expected output
A versioned reward model, evaluation report, supported-use envelope, normalization policy, and known exploitability risks.

## Stop conditions
Stop if the reward model can be improved substantially by trivial heuristics, fails critical safety slices, exhibits severe exploitable bias, or does not generalize to samples from the target policy.