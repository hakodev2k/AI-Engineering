# Bias and Fairness Risk Rules

## Purpose
Identify and control materially unequal or unjustified model outcomes across relevant populations and contexts.

## Scope
Applies where model outputs can affect people, access, opportunities, prioritization, safety, or other consequential outcomes.

## MUST
- Fairness analysis MUST identify relevant groups, decision contexts, plausible harms, and metrics appropriate to the use case.
- High-impact use cases MUST evaluate outcome disparities across meaningful slices when data and law permit.
- Material disparities MUST be investigated for root causes before release or risk acceptance.
- Mitigations MUST be tested for both intended improvement and regressions in overall or subgroup performance.
- Fairness conclusions MUST document known measurement limitations and population coverage.

## MUST NOT
- A single fairness metric MUST NOT be treated as universally sufficient across all contexts.
- Sensitive attributes MUST NOT be collected or inferred without a legitimate, authorized purpose.

## SHOULD
- Fairness review SHOULD involve domain expertise when harms depend on social, legal, or operational context.
- Teams SHOULD monitor post-deployment disparity signals when production data supports responsible measurement.

## Exceptions
When subgroup measurement is impossible or prohibited, document the reason, alternative evidence, residual uncertainty, and reviewer approval.

## Verification
Inspect slice definitions, disparity analyses, mitigation experiments, legal or policy constraints, and production monitoring plans.