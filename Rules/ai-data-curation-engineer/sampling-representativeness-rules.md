# Sampling and Representativeness Rules
## Purpose
Ensure curated datasets reflect intended populations, tasks, and operating conditions.
## Scope
Sampling, balancing, stratification, cohort construction, and dataset composition.
## MUST
- Sampling objectives MUST be defined against the model's intended use and evaluation goals.
- Material cohorts MUST be measured for representation and coverage.
- Oversampling, undersampling, weighting, or balancing decisions MUST be documented with expected effects.
## MUST NOT
- Convenience sampling MUST NOT be represented as population-representative without evidence.
- Aggregate distribution metrics MUST NOT hide known critical cohort gaps.
## SHOULD
- Rare but high-risk scenarios SHOULD receive deliberate coverage even when naturally infrequent.
## Exceptions
Exceptions require documented limitations, expected impact, and approval for high-risk uses.
## Verification
Review sampling code, cohort distributions, source distributions, coverage reports, and dataset cards.