# Statistical Validity Rules

## Purpose
Prevent misleading conclusions caused by insufficient sample size, noisy metrics, inappropriate aggregation, or unsupported significance claims.

## Scope
Applies to comparative evaluations, experiments, benchmark summaries, human preference studies, and production quality analyses.

## MUST
- Reported comparisons MUST include sample counts and enough uncertainty information to judge practical reliability.
- Evaluation methods MUST account for paired observations when the same items are scored across candidate systems.
- Material subgroup results MUST be analyzed separately when aggregate metrics can hide regressions.
- Statistical significance MUST NOT substitute for practical significance; effect size and decision relevance MUST be considered.
- Repeated testing, metric selection, or subgroup slicing that affects inferential claims MUST be disclosed and controlled appropriately.

## MUST NOT
- MUST NOT claim superiority from tiny score differences without evidence that the difference is stable and meaningful.
- MUST NOT drop failed, timed-out, or invalid outputs from denominators unless the exclusion rule was defined in advance and disclosed.
- MUST NOT present confidence intervals or significance tests whose assumptions are materially violated without qualification.

## SHOULD
- Power or sensitivity analysis SHOULD guide sample sizing for consequential comparisons.
- Bootstrap or other robust methods SHOULD be considered when metric distributions violate simple parametric assumptions.

## Exceptions
Exploratory analyses may use weaker statistical controls if explicitly labeled exploratory and excluded from final release claims.

## Verification
Inspect analysis code, sample counts, inclusion rules, uncertainty estimates, subgroup breakdowns, and reproducibility artifacts. Recompute a representative comparison from raw results.