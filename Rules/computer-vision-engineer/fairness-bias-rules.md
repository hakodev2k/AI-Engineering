# Fairness and Bias Rules

## Purpose
Identify and control systematic performance disparities relevant to people and consequential outcomes.

## Scope
Datasets, labels, model outputs, thresholds, demographic or contextual subgroups, and human-facing decisions.

## MUST
- Relevant protected or risk-sensitive groups MUST be evaluated when legally and ethically permissible and when model behavior can affect them differently.
- Disparities MUST be interpreted with sample size, label quality, task prevalence, and operational consequences.
- Mitigations MUST be validated for both targeted disparities and overall safety/utility regressions.
- Known material limitations MUST be communicated to downstream decision makers.

## MUST NOT
- Aggregate accuracy MUST NOT be used to dismiss demonstrated harmful subgroup failures.
- Sensitive attributes MUST NOT be collected solely for convenience without legitimate purpose and controls.

## SHOULD
- Dataset design SHOULD seek representative coverage of deployment populations and conditions.

## Exceptions
Where sensitive attributes cannot be used, alternative audits require documented limitations and privacy/legal review where appropriate.

## Verification
Inspect subgroup metrics, sampling counts, confidence intervals, dataset composition, mitigation experiments, and documented limitations.