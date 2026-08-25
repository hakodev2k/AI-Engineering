# Fairness, Bias and Responsible ML

## Purpose
Identify and mitigate harmful performance disparities, inappropriate proxies and high-impact failure modes throughout the ML lifecycle.

## When to use
Use when model outputs affect people, access, prioritization, pricing, moderation, risk or other consequential decisions.

## Inputs
Use case, affected groups, features, labels, decision policy, slice metrics, legal/policy constraints and human-review process.

## Context to inspect
Data-generation process, historical bias, protected/sensitive attributes, proxy features, feedback loops and appeal mechanisms.

## Core knowledge
Fairness is contextual; incompatible fairness criteria can conflict. Removing sensitive attributes does not remove proxy bias. Model metrics and decision-policy effects must both be assessed.

## Procedure
1. Classify impact and affected stakeholders.
2. Identify plausible harms and vulnerable slices.
3. Audit data/labels for representation and historical bias.
4. Measure error, calibration and decision rates by relevant groups.
5. Investigate proxies and feedback loops.
6. Evaluate mitigation at data, model and policy layers.
7. Quantify utility/fairness trade-offs explicitly.
8. Add human review, explanation or appeal where appropriate.
9. Define production fairness guardrails.
10. Document limitations and residual risk.

## Decision points
Choose mitigation based on the actual harm model, not a generic parity target. Escalate high-impact policy choices to accountable stakeholders.

## Common failure patterns
Fairness through unawareness, tiny slices treated as conclusive, optimizing one parity metric blindly and ignoring downstream policy.

## Verification
Recompute slice metrics on held-out data, stress-test edge populations and review mitigation with domain/risk stakeholders.

## Expected output
A responsible-ML assessment with measured disparities, mitigations and residual risks.

## Stop conditions
Stop deployment when unacceptable high-impact disparities or unresolved policy/legal constraints remain.