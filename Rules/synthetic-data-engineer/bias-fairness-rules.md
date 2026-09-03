# Bias and Fairness Rules

## Purpose
Prevent synthetic data from silently amplifying, erasing, or fabricating disparities that can distort downstream systems.

## Scope
Applies to protected, sensitive, operationally important, and underrepresented groups and to labels or outcomes that may encode historical bias.

## MUST
- Define relevant groups and fairness risks from the intended use rather than relying only on attributes available in the dataset.
- Compare representation, error, label, outcome, and conditional distributions across material subgroups.
- Evaluate whether balancing or oversampling changes the meaning of prevalence-sensitive tasks.
- Document intentional distribution shifts and their expected downstream effect.
- Escalate synthetic datasets that materially worsen harmful disparities relative to approved baselines.

## MUST NOT
- Claim fairness solely because protected attributes were removed.
- Equalize group counts without analyzing causal, sampling, and label implications.
- Use synthetic balancing to hide known source-data quality problems.
- Report only global quality metrics when subgroup harms are plausible.

## SHOULD
- Include intersectional and small-group analysis where sample sizes permit responsible interpretation.
- Test downstream models trained on synthetic data for group-specific performance changes.
- Engage domain or policy reviewers when fairness definitions are consequential or contested.

## Exceptions
Any accepted disparity requires documented business or scientific rationale, evidence, residual risk, and appropriate human approval.

## Verification
Review subgroup metrics, downstream outcome comparisons, balancing logic, fairness test results, and documentation of intentional shifts and approvals.