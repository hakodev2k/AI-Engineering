# Direct Preference Optimization

## Purpose
Apply DPO-family preference optimization to improve chosen-over-rejected behavior while controlling divergence from a reference policy.

## When to use
Use when high-quality preference pairs exist and policy improvement can be learned without an online reward-model loop. Avoid when rewards are naturally verifiable online, preferences change rapidly with policy behavior, or exploration is central to the task.

## Inputs
Reference/SFT checkpoint, preference pairs, chat template, objective metrics, preservation evaluations, and compute budget.

## Preconditions
Chosen/rejected labels are trustworthy, candidate formatting is consistent, and the reference policy matches the intended training initialization.

## Context to inspect
Review pair difficulty, response-length differences, source-model imbalance, label noise, beta/regularization conventions, loss implementation, and existing SFT regressions.

## Core knowledge
DPO converts preference learning into a classification-like objective based on policy/reference log-probability ratios. The regularization strength controls how aggressively the policy departs from the reference. Dataset biases can be amplified because optimization learns comparative cues, not human intent directly. Variants differ in assumptions about labels, margins, and reference use.

## Procedure
1. Reproduce reference-policy evaluations and archive exact checkpoint/tokenizer/template versions.
2. Validate chosen/rejected sequence construction and response-only log-probability masks.
3. Inspect per-example length and token-count distributions.
4. Run a small training smoke test and confirm stable loss/log-ratio statistics.
5. Sweep a narrow range of regularization strengths rather than tuning only learning rate.
6. Track target win rate, KL-like divergence proxies, safety, calibration, and preserved capabilities.
7. Audit samples where preference accuracy improves but user-facing quality declines.
8. Evaluate difficult and ambiguous pairs separately from easy pairs.
9. Compare against an SFT-only control to prove incremental value.
10. Check for verbosity, refusal, stylistic, or formatting drift.
11. Select checkpoints by multi-metric criteria rather than training loss.
12. Re-run independent preference evaluation on unseen prompts.

## Decision points
Use DPO when offline preference data is representative and iteration simplicity matters. Consider noise-robust variants when labels are uncertain, margin-aware methods when preference strength is meaningful, and online RL when the policy must explore behaviors not represented in static pairs.

## Common failure patterns
Wrong reference checkpoint; loss masking bugs; aggressive beta/learning-rate combination; length bias; easy-pair domination; preference overfitting; treating higher pairwise training accuracy as deployment readiness.

## Verification
Confirm correct log-probabilities on hand-inspected examples, stable training, measurable improvement over SFT, acceptable policy divergence, and no critical regression on independent target/safety/preservation suites.

## Expected output
A reproducible preference-optimized checkpoint with experiment configuration, comparison to SFT baseline, divergence analysis, slice-level evaluations, and selection rationale.

## Stop conditions
Stop if preference gains require unacceptable safety/capability loss, log-ratio behavior indicates implementation error, labels are too noisy for stable optimization, or improvements disappear on independently generated candidates.