# Causal Inference Rules

## Purpose
Prevent unsupported causal claims from observational or experimental data.

## Scope
A/B tests, quasi-experiments, observational studies, and impact analyses.

## MUST
- Define the treatment, outcome, comparison group, and identification assumptions for causal questions.
- Check randomization integrity for experiments.
- Identify material confounders and selection effects in observational work.
- Separate pre-treatment from post-treatment variables.
- Report threats to identification and sensitivity where relevant.

## MUST NOT
- MUST NOT label an association as causal solely because it is statistically significant.
- MUST NOT condition on variables that introduce known collider or post-treatment bias without justification.

## SHOULD
- Prefer experimental or quasi-experimental evidence when feasible for high-impact decisions.

## Exceptions
Descriptive analysis may discuss plausible mechanisms if explicitly framed as hypotheses, not effects.

## Verification
Inspect study design, assignment logic, covariate balance, assumptions, robustness checks, and conclusion wording.