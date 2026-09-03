# Baseline Selection

## Purpose
Choose and validate comparison baselines that make AI research claims credible, fair, and decision-relevant. This skill prevents misleading improvements caused by weak implementations, mismatched compute, different data, or inconsistent evaluation protocols.

## When to use
Use before running comparative experiments, reproducing a paper, proposing a new model architecture, evaluating a training intervention, or preparing results for review. Revisit it whenever a stronger public or internal baseline appears.

## Inputs
- Research hypothesis
- Candidate baseline models or methods
- Available datasets and evaluation suite
- Compute and time budget
- Existing implementations or checkpoints
- Historical internal results

## Preconditions
The target task, primary metric, and experiment constraints must be defined. Determine whether the intended claim concerns absolute capability, efficiency, robustness, sample efficiency, scaling behavior, or another dimension.

## Context to inspect
Inspect official implementations, model size, parameter count, architecture, training tokens/examples, optimizer schedule, data composition, augmentation, inference settings, prompt templates, decoding parameters, hardware, precision, and evaluation scripts. Check whether a baseline was tuned for the same benchmark.

## Core knowledge
A credible baseline is not merely popular; it must be strong under comparable conditions. Fairness can require matching model size, compute, training data, wall-clock budget, inference budget, or quality target depending on the claim. Multiple baselines are often necessary: a simple reference baseline, a strong established baseline, and the current internal system.

## Procedure
1. State exactly what the new method claims to improve.
2. Define the comparison axis that must remain controlled.
3. Identify the current internal baseline and strongest relevant external baselines.
4. Prefer official checkpoints or validated implementations where possible.
5. Document differences in data, model scale, compute, and evaluation settings.
6. Reproduce the baseline metric in the local evaluation harness before comparing methods.
7. Tune baseline hyperparameters with a budget comparable to the proposed method when tuning affects the claim.
8. Include a simple baseline that reveals whether complexity is necessary.
9. Include an ablation or nearest-method baseline that isolates the claimed novelty.
10. Standardize inference settings such as temperature, beam width, context length, or test-time sampling.
11. Record baseline variance across seeds or repeated evaluations when stochasticity matters.
12. Reject comparisons that cannot be made fairly and label them separately as contextual references.
13. Freeze the validated baseline configuration for the confirmatory experiment.

## Decision points
- Match training compute when claiming algorithmic efficiency under fixed budget.
- Match parameter count when claiming architectural quality independent of scale.
- Match output quality when comparing cost or latency.
- Use a production baseline when the decision is operational, even if an academic baseline is stronger on a narrow benchmark.
- Retain multiple baselines when no single comparison answers all relevant questions.

## Common failure patterns
- Comparing against an untuned baseline while heavily tuning the new method.
- Reusing published numbers from a different evaluation harness.
- Ignoring hidden differences in training data or inference compute.
- Selecting only baselines that make the proposed method look favorable.
- Omitting the current production system.
- Failing to reproduce the expected baseline before interpreting improvements.

## Verification
Selection is implemented when baseline configurations are documented and runnable. It is verified when reproduced baseline results fall within expected tolerance, comparison budgets are explicit, evaluation settings are identical where required, and reviewers can determine which claims each baseline supports.

## Expected output
A baseline matrix describing each method, source, model/data/compute budget, evaluation configuration, reproduced result, variance, known caveats, and the research claim it is suitable for testing.

## Stop conditions
Stop and escalate when no baseline can be reproduced, critical configuration details are unavailable, comparison budgets differ so much that the intended claim becomes invalid, or licensing prevents use of the necessary baseline.