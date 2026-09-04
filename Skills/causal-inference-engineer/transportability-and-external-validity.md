# Transportability and External Validity

## Purpose
Assess whether a causal effect estimated in one sample, experiment, geography, period, or population can support decisions in another target population.

## When to use
Use when deploying results beyond the original study sample, transferring experiment findings to production, or combining studies with target-population data.

## Inputs
- Source-study estimate and covariates
- Source and target population definitions
- Effect modifiers
- Sampling/eligibility mechanisms
- Target-population covariate distribution

## Context to inspect
Inspect differences in treatment implementation, baseline risk, effect modifiers, measurement, environment, support, eligibility, and calendar time.

## Core knowledge
Internal validity does not imply external validity. Transport can require conditional exchangeability over sampling, positivity between source and target populations, consistent treatment versions, and explicit modeling or weighting of effect modifiers.

## Procedure
1. Define the exact source and target populations.
2. Compare treatment versions and outcome measurement across settings.
3. Identify plausible effect modifiers using causal/domain knowledge.
4. Compare their distributions between source and target.
5. Assess target support within the source data.
6. Choose standardization, inverse-odds-of-sampling weighting, outcome modeling, or doubly robust transport estimation as appropriate.
7. Estimate target-population effects with uncertainty.
8. Inspect weight concentration and effective sample size.
9. Run sensitivity analyses for unmeasured effect modifiers.
10. Validate against any target-domain outcomes or historical interventions.
11. State precisely where extrapolation remains unsupported.

## Decision points
Transport directly only when populations are sufficiently comparable. Reweight or standardize when measured effect modifiers differ. Prefer a new experiment when target support is weak or treatment implementation materially changes.

## Common failure patterns
- Assuming a randomized effect automatically generalizes
- Ignoring treatment-version differences
- Extrapolating outside source support
- Reweighting on predictive variables without causal relevance
- No uncertainty for transport weights

## Verification
Verify source-target overlap, balance after transport adjustment, treatment comparability, effective sample size, and robustness to alternative effect-modifier sets.

## Expected output
A target-population effect estimate, transport diagnostics, unsupported regions, sensitivity analysis, and deployment recommendation.

## Stop conditions
Stop transport claims when source and target lack common support, treatment versions are not comparable, or key effect modifiers are unavailable.