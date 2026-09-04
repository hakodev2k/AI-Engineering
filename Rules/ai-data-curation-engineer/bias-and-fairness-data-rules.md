# Bias and Fairness Data Rules
## Purpose
Identify and control dataset composition and labeling patterns that can create systematic performance disparities.
## Scope
Cohort representation, proxies, labels, sampling, exclusions, and dataset transformations.
## MUST
- Known high-impact cohorts MUST be evaluated for coverage, label quality, and systematic differences relevant to the intended use.
- Potential proxies for sensitive attributes MUST be identified when they can materially affect outcomes.
- Mitigation decisions MUST preserve evidence of the original problem and expected trade-offs.
## MUST NOT
- Fairness claims MUST NOT rely only on overall dataset balance.
- Sensitive cohort gaps MUST NOT be concealed by aggregation.
## SHOULD
- Dataset review SHOULD include domain experts when social or contextual meaning affects labels.
## Exceptions
Exceptions require documented limitations, evidence, and accountable risk acceptance.
## Verification
Review cohort statistics, label error rates, proxy analyses, sampling decisions, and downstream evaluation evidence.