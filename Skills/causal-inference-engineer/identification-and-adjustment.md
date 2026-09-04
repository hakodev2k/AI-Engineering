# Identification and Adjustment

## Purpose
Determine whether a causal estimand is identifiable from the available data and assumptions before fitting an estimator.

## When to use
Use for observational causal analyses, especially before regression, weighting, matching, or machine-learning adjustment.

## Inputs
- Estimand
- Causal DAG or equivalent assumptions
- Available covariates
- Treatment assignment process
- Sample definition

## Context to inspect
Inspect confounder availability, positivity, treatment timing, censoring, selection, measurement quality, and whether relevant variables are pre-treatment.

## Core knowledge
Identification requires assumptions such as consistency, conditional exchangeability, positivity, and correct temporal alignment. Backdoor, front-door, randomization, instrumental-variable, and discontinuity designs are alternative identification routes.

## Procedure
1. Restate the estimand and target population.
2. Enumerate causal paths between treatment and outcome.
3. Determine candidate identification strategies.
4. For backdoor adjustment, derive a sufficient pre-treatment set.
5. Assess empirical overlap and structural positivity.
6. Check whether treatment versions violate consistency.
7. Evaluate censoring and selection mechanisms.
8. Separate identification assumptions from estimator assumptions.
9. Document threats that diagnostics cannot rule out.
10. Reject the analysis if identification depends on implausible assumptions.

## Decision points
Prefer design-based identification over increasingly flexible outcome models. Use front-door or IV methods only when their stronger specialized assumptions are credible.

## Common failure patterns
- Assuming adjustment implies identification
- Ignoring positivity violations
- Using post-treatment controls
- Treating model fit as evidence of causal validity
- Failing to distinguish missing confounders from noisy confounders

## Verification
Verify every identification assumption is explicit, mapped to evidence or domain rationale, and compatible with the observed treatment support.

## Expected output
An identification memo specifying the estimand, strategy, assumptions, diagnostics, and unresolved threats.

## Stop conditions
Stop when exchangeability or an alternative identification strategy is not credible, or when required treatment support is absent.