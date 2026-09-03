# Hyperparameter Search

## Purpose
Search AI training and inference hyperparameters efficiently while preserving fair comparisons and avoiding benchmark overfitting. This skill treats tuning budget, search space, and selection policy as part of the experiment rather than hidden implementation details.

## When to use
Use when a baseline or proposed method is sensitive to optimization, regularization, architecture constants, decoding settings, or other tunable choices. Use before confirmatory comparisons when inadequate tuning could bias conclusions.

## Inputs
- Validated training/evaluation pipeline
- Search budget
- Candidate hyperparameters and ranges
- Validation metrics
- Resource constraints
- Prior tuning results

## Preconditions
Define the primary validation metric and a fixed test set that will not be used for tuning. Ensure failures and incomplete runs can be distinguished from poor configurations.

## Context to inspect
Inspect prior experiments, parameter interactions, log scales, known stable ranges, scheduler semantics, early-stopping behavior, hardware limits, variance across seeds, and whether baseline and treatment receive comparable tuning opportunity.

## Core knowledge
Search quality depends more on choosing meaningful spaces and budgets than on using a sophisticated optimizer. Random or Bayesian search can outperform grids in high-dimensional spaces, but adaptive search can overfit validation metrics. Learning rate, batch size, warmup, regularization, context length, and optimizer parameters often interact. Search results should identify robust regions, not merely one lucky point.

## Procedure
1. Separate fixed design choices from tunable hyperparameters.
2. Use domain knowledge and pilot evidence to define plausible ranges.
3. Use logarithmic scales for multiplicative quantities such as learning rate or weight decay when appropriate.
4. Define the total search budget before launching runs.
5. Allocate equivalent or justified budgets to competing methods.
6. Start with broad low-fidelity exploration using shorter runs or smaller scales when those fidelities preserve ranking reasonably well.
7. Promote promising regions to full-fidelity experiments.
8. Track failed and unstable configurations as evidence.
9. Analyze parameter interactions rather than only marginal effects.
10. Repeat promising configurations across seeds when variance matters.
11. Select a configuration using the predefined validation policy.
12. Freeze it before final test evaluation.
13. Report search space, budget, selection rule, and sensitivity around the selected point.

## Decision points
- Prefer random search when only a few dimensions strongly matter and the space is not well characterized.
- Prefer Bayesian or bandit methods when trials are expensive and comparable intermediate signals exist.
- Use manual search for tightly constrained mechanistic investigations where each run tests an interpretable hypothesis.
- Avoid changing the search budget after seeing favorable or unfavorable results unless the new phase is explicitly exploratory.

## Common failure patterns
- Tuning the proposed method more extensively than the baseline.
- Using test-set feedback to choose hyperparameters.
- Reporting only the best run and hiding sensitivity.
- Defining ranges so narrow that the baseline is artificially weak.
- Using short-run ranking when it poorly predicts full-run performance.
- Treating OOM or NaN failures as missing data rather than method robustness information.

## Verification
Implementation is complete when the planned search executes and all trials are traceable. Verification requires frozen test data, documented search budget and space, reproducible winning configurations, repeated validation of promising points, and evidence that the selected setting lies in a reasonably stable region or is explicitly identified as fragile.

## Expected output
A search specification, complete trial record, parameter-response analysis, selected configuration, sensitivity evidence, and fair-budget comparison notes.

## Stop conditions
Stop when the validation metric is unreliable, search results are dominated by infrastructure failures, the available budget cannot distinguish meaningful regions, or adaptive tuning has contaminated the intended final evaluation.