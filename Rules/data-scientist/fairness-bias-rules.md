# Fairness and Bias Rules
## Purpose
Detect and control harmful or decision-relevant bias.
## Scope
Datasets, labels, models, experiments, and automated decisions.
## MUST
- Identify populations that could experience materially different outcomes and evaluate relevant performance or outcome disparities.
- Investigate whether sampling, labels, proxies, missingness, or historical processes create bias.
- Escalate consequential unresolved disparities before deployment.
## MUST NOT
- Claim fairness from one metric or aggregate parity alone.
- Remove protected attributes while ignoring correlated proxies and outcome effects.
## SHOULD
- Select fairness criteria based on context, harm, and legal/policy constraints.
## Exceptions
Unavailable demographic data requires documented limitation and alternative risk assessment.
## Verification
Inspect slice metrics, data provenance, bias analysis, mitigation evidence, and approval records.