# Causal Problem Formulation

## Purpose
Translate a business, policy, scientific, or product question into an explicit causal estimand and analysis plan. Senior causal work starts by defining the intervention and target quantity before choosing an estimator.

## When to use
Use when stakeholders ask whether an action caused an outcome, what would happen under an intervention, or which policy should be preferred. Do not use causal language for purely predictive questions.

## Inputs
- Decision question and intervention
- Outcome definition and horizon
- Target population
- Available observational or experimental data
- Operational constraints and known confounders

## Context to inspect
Inspect how treatment is assigned, timing of covariates/treatment/outcome, units of analysis, exposure versions, censoring, selection, and whether interference between units is plausible.

## Core knowledge
Define potential outcomes, treatment versions, estimand, population, time zero, and assumptions. Distinguish ATE, ATT, CATE, risk difference, ratio, odds ratio, survival effects, and policy value. Identification and estimation are separate problems.

## Procedure
1. Rewrite the question as a hypothetical intervention.
2. Define unit, treatment, comparator, outcome, horizon, and target population.
3. State the estimand mathematically or operationally.
4. Draw the timeline and forbid post-treatment covariates from baseline adjustment.
5. Identify likely confounders, mediators, colliders, and effect modifiers.
6. Determine whether randomization, natural experiment, or observational identification is available.
7. Write required identification assumptions.
8. Choose candidate estimators only after identification is justified.
9. Predefine diagnostics, sensitivity analyses, and falsification tests.
10. Confirm that the estimand answers the actual decision.

## Decision points
Prefer experiments when feasible and ethical. Use observational identification only when assumptions are defensible. Prefer policy-value estimands when the goal is treatment assignment rather than average effect reporting.

## Common failure patterns
- Vague treatment definition
- Conditioning on post-treatment variables
- Estimand changed after seeing results
- Predictive association presented as causal effect
- Target population differs from analyzed sample

## Verification
Verify the treatment/comparator, target population, time zero, outcome window, estimand, and assumptions can all be stated unambiguously and independently reviewed.

## Expected output
A causal question specification with estimand, timeline, assumptions, data requirements, and analysis strategy.

## Stop conditions
Stop when the intervention is undefined, temporal ordering is unknown, or no credible identification strategy can be defended.