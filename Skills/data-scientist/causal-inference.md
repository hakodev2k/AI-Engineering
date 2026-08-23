# Causal Inference

## Purpose
Estimate effects of interventions when causal decisions are required and randomized experiments are unavailable or incomplete.

## When to use
Use for policy impact, treatment effects, observational comparisons, and counterfactual questions. Do not use causal language for ordinary predictive associations.

## Inputs
Causal question, treatment, outcome, covariates, timing, domain assumptions, and observational or quasi-experimental data.

## Context to inspect
Treatment assignment mechanism, confounders, mediators, colliders, selection, interference, and temporal ordering.

## Core knowledge
Identification comes from assumptions plus design, not from an algorithm. DAGs clarify adjustment sets. Matching, weighting, regression, difference-in-differences, regression discontinuity, instrumental variables, and synthetic controls rely on different assumptions.

## Procedure
1. Define treatment, outcome, population, and estimand.
2. Draw a causal graph with domain experts.
3. State the identification assumptions explicitly.
4. Select a design that matches the assignment mechanism.
5. Check overlap and covariate balance.
6. Estimate effects with uncertainty.
7. Test design-specific diagnostics such as pre-trends or discontinuity manipulation.
8. Run sensitivity analyses for hidden bias and specification choices.
9. Separate identified conclusions from assumption-dependent interpretation.

## Decision points
Prefer natural experiments or stronger designs over complex adjustment when available. Do not control for mediators or colliders merely because they predict the outcome.

## Common failure patterns
Adjusting for every variable, conditioning on post-treatment data, weak instruments, unsupported parallel trends, poor overlap, and presenting observational estimates as experimental truth.

## Verification
Confirm temporal ordering, diagnostics, balance, robustness, and explicit assumptions with subject-matter experts.

## Expected output
A causal estimate with identification strategy, diagnostics, sensitivity analysis, and bounded interpretation.

## Stop conditions
Stop when no credible identification strategy exists or assumptions are contradicted by evidence.