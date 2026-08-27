# Bias and Fairness Evaluation Rules

## Purpose
Detect material performance disparities and harmful systematic behavior across relevant populations and contexts.

## Scope
Applies when AI outputs or decisions can vary meaningfully across demographic, linguistic, geographic, accessibility, cultural, or other product-relevant groups.

## MUST
- Fairness evaluation MUST identify which groups and contexts are relevant to the system's use and risk profile.
- Group comparisons MUST use metrics appropriate to the product behavior rather than generic parity measures selected without context.
- Material disparities MUST be investigated for data, model, prompt, policy, or measurement causes before release decisions.
- Evaluation datasets MUST document group representation limitations and uncertainty for sparse subgroups.
- High-impact fairness conclusions MUST be reviewed by qualified humans and MUST NOT rely solely on model-generated demographic inference.

## MUST NOT
- MUST NOT infer sensitive attributes from users or evaluation data unless there is a legitimate, approved, privacy-compliant need.
- MUST NOT claim fairness from aggregate performance that omits relevant subgroup analysis.
- MUST NOT hide unfavorable subgroup results behind weighted averages.

## SHOULD
- Intersectional analysis SHOULD be used where single-axis group analysis could conceal material harms.
- Qualitative review SHOULD complement quantitative metrics for stereotype, dignity, and representation failures.

## Exceptions
If subgroup analysis is not relevant or lawful for a specific system, the rationale and alternative risk controls MUST be documented.

## Verification
Inspect subgroup definitions, privacy basis, sampling coverage, metric selection, uncertainty, disparity investigations, and review records. Confirm reported claims match the evaluated populations.