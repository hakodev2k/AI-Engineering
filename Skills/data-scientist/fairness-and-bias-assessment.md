# Fairness and Bias Assessment

## Purpose
Identify and mitigate harmful performance disparities, representation problems, and decision risks across affected populations.

## When to use
Use for models or analyses influencing access, ranking, pricing, eligibility, prioritization, or other consequential outcomes.

## Inputs
Model, predictions, labels, protected or relevant groups where lawful, decision policy, and harm definitions.

## Context to inspect
Historical inequities, label bias, selection mechanisms, proxy variables, subgroup sample sizes, and legal/privacy constraints.

## Core knowledge
Fairness metrics encode different normative goals and can conflict. Equalized error rates, demographic parity, calibration, individual fairness, and utility are not interchangeable. Measurement bias cannot be fixed solely at the model layer.

## Procedure
1. Define plausible harms and affected groups with stakeholders.
2. Audit representation and label quality by group.
3. Measure baseline and model outcomes across groups.
4. Quantify uncertainty, especially for small subgroups.
5. Investigate feature proxies and pipeline sources of disparity.
6. Compare mitigation options at data, model, threshold, and process levels.
7. Evaluate utility and harm trade-offs after mitigation.
8. Document governance decisions and residual risks.
9. Define ongoing disparity monitoring.

## Decision points
Do not choose a fairness metric mechanically; align it with the actual harm and legal context. Prefer process redesign when model adjustments cannot address structural bias.

## Common failure patterns
Fairness washing, tiny-sample comparisons, removing protected attributes while retaining proxies, and optimizing one metric without considering consequences.

## Verification
Re-run subgroup evaluation on holdout data and review conclusions with appropriate domain, legal, or governance owners.

## Expected output
A documented bias assessment, mitigation decision, evidence, and monitoring plan.

## Stop conditions
Escalate when protected-data use, legal interpretation, or acceptable harm requires authorized review.