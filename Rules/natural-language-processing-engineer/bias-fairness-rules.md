# Bias and Fairness Rules

## Purpose
Detect and control harmful or unjustified quality disparities in NLP systems.

## Scope
Datasets, labels, models, language/dialect coverage, subgroup evaluation, proxies, and deployment monitoring.

## MUST
- Relevant protected or vulnerable groups and linguistic subgroups MUST be considered during risk analysis when the use case can affect them.
- Material disparities MUST be measured with metrics appropriate to the decision context.
- Known dataset representation gaps and model limitations MUST be documented.
- High-impact fairness regressions MUST block release until accepted by accountable reviewers.

## MUST NOT
- MUST NOT infer sensitive attributes merely to simplify product logic without approved necessity and controls.
- MUST NOT use aggregate accuracy to dismiss subgroup harm.
- MUST NOT claim fairness from absence of demographic fields alone.

## SHOULD
- Evaluation SHOULD include dialect, register, language, name, and identity-term perturbations where relevant.
- Mitigations SHOULD be validated for both target disparity and collateral quality loss.

## Exceptions
Unavailable subgroup data requires a documented alternative evaluation strategy and residual-risk statement.

## Verification
Review representation analyses, subgroup metrics, counterfactual tests, mitigation experiments, release gates, and monitored production disparities where lawful and feasible.