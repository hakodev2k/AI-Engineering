# Model Interpretability

## Purpose
Explain model behavior at the level required for debugging, governance, stakeholder decisions, and safe use without overstating what explanations prove.

## When to use
Use for high-impact models, debugging, feature review, adverse decisions, and stakeholder communication.

## Inputs
Model, features, predictions, representative data, intended audience, and explanation requirement.

## Context to inspect
Model family, correlated features, feature transformations, data distribution, decision policy, and regulatory expectations.

## Core knowledge
Global importance, local attribution, partial dependence, counterfactuals, and surrogate models answer different questions. Attribution is not causality. Correlated features can make importance unstable or misleading.

## Procedure
1. Define who needs an explanation and for what decision.
2. Start with transparent model structure when available.
3. Measure global behavior and dominant features.
4. Inspect local explanations for representative and high-risk cases.
5. Test sensitivity to correlated features and perturbation assumptions.
6. Compare explanations across cohorts and model versions.
7. Use counterfactuals only with feasible, actionable constraints.
8. Validate explanation claims against known model behavior.
9. Communicate limitations explicitly.

## Decision points
Prefer inherently interpretable models when explanation requirements outweigh small accuracy gains. Use post-hoc methods as diagnostic approximations, not truth generators.

## Common failure patterns
Calling SHAP values causal effects, presenting impossible counterfactuals, ignoring correlated features, and using one example to characterize the whole model.

## Verification
Cross-check explanations with controlled perturbations, model coefficients/structure, and domain expectations.

## Expected output
Audience-appropriate explanations with scope, evidence, uncertainty, and limitations.

## Stop conditions
Stop when explanation methods cannot support the required legal or safety interpretation.