# Statistical Fidelity Rules

## Purpose
Ensure synthetic data preserves the statistical properties required by its intended use without confusing resemblance with correctness.

## Scope
Applies to marginal distributions, joint dependencies, correlations, temporal behavior, conditional relationships, missingness, and subgroup characteristics.

## MUST
- Define which statistical properties are material to downstream use before measuring fidelity.
- Compare synthetic and reference data using multiple complementary metrics rather than a single aggregate score.
- Evaluate univariate, multivariate, conditional, and tail behavior when those properties affect decisions.
- Report uncertainty and sample-size effects for fidelity estimates where material.
- Investigate large deviations instead of averaging them away across features or populations.

## MUST NOT
- Claim high fidelity from visual similarity alone.
- Optimize fidelity metrics by copying or memorizing source records.
- Treat correlation preservation as proof of causal or semantic correctness.
- Conceal subgroup failures behind population-level averages.

## SHOULD
- Use domain-specific fidelity tests in addition to generic statistical distances.
- Establish tolerance bands tied to downstream sensitivity.
- Retain baseline comparisons for real-versus-real sampling variability.

## Exceptions
Relaxed fidelity requires documented rationale showing the property is irrelevant or intentionally altered, plus validation of downstream impact.

## Verification
Review distribution tests, dependency analyses, subgroup reports, tail metrics, uncertainty estimates, and downstream sensitivity experiments against predefined thresholds.