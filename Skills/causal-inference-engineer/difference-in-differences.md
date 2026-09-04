# Difference in Differences

## Purpose
Estimate policy or intervention effects from treated and comparison groups observed over time while making the parallel-trends assumption explicit and testable where possible.

## When to use
Use for staggered or common-time interventions with repeated outcomes and credible untreated comparison units.

## Inputs
- Unit and time identifiers
- Treatment adoption timing
- Outcome history
- Pre-treatment covariates
- Comparison-group rationale

## Context to inspect
Inspect treatment timing, anticipation, dynamic effects, composition changes, repeated cross-sections versus panels, and whether treatment reverses.

## Core knowledge
Modern DiD requires care with heterogeneous treatment effects and staggered adoption. Two-way fixed-effects coefficients can be misleading under effect heterogeneity. Event studies are diagnostics and dynamic estimators, not proof of parallel trends.

## Procedure
1. Define treated cohorts, comparison units, and event time.
2. Establish the no-anticipation assumption.
3. Plot raw pre/post outcome trajectories.
4. Assess pre-treatment trend comparability and composition.
5. Choose an estimator appropriate for staggered adoption and heterogeneous effects.
6. Estimate cohort-time effects before aggregating.
7. Use event-study plots with valid reference periods.
8. Cluster standard errors at the assignment level when appropriate.
9. Run placebo treatment dates and alternative comparison groups.
10. Test sensitivity to covariate adjustment and time windows.
11. Document what parallel trends means for the chosen estimand.

## Decision points
Prefer cohort-aware estimators for staggered treatment. Use synthetic controls or matching when untreated trends differ substantially but can be improved by design.

## Common failure patterns
- Blind two-way fixed effects under staggered adoption
- Interpreting insignificant pre-trends as proof
- Ignoring anticipation
- Incorrect standard-error clustering
- Changing comparison groups after seeing effects

## Verification
Verify pre-period coverage, treatment timing, comparison eligibility, event-time coding, clustering, placebo results, and robustness across reasonable specifications.

## Expected output
Dynamic and aggregated treatment effects with assumptions, diagnostics, uncertainty, and sensitivity analyses.

## Stop conditions
Stop when no credible comparison trajectory exists or treatment timing/outcome history is too incomplete to support the design.