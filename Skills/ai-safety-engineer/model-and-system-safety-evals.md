# Model and System Safety Evals

## Purpose
Measure safety behavior at both model and end-to-end system levels using repeatable evidence.

## When to use
Use for model selection, release gating, configuration changes, and regression monitoring.

## Inputs
Safety requirements, datasets, system configurations, scoring rubrics, baseline results.

## Context to inspect
Model version, prompts, sampling settings, tools, retrieval, filters, locale, and deployment-specific controls.

## Core knowledge
Model-level results do not automatically predict system risk. Evaluation sets need representative distributions, adversarial slices, severity weighting, and uncertainty estimates.

## Procedure
1. Define claims the evaluation should support.
2. Select representative and adversarial datasets.
3. Define objective or rubric-based scoring.
4. Freeze configuration metadata.
5. Establish baselines and acceptable deltas.
6. Run sufficient samples for stochastic behavior.
7. Segment results by risk-relevant slices.
8. Inspect severe failures qualitatively.
9. Compare utility and safety together.
10. Store cases for regression testing.

## Decision points
Use human graders where semantics require judgment; use automated graders only after validating agreement and bias.

## Common failure patterns
Single aggregate score; hidden prompt changes; leakage between train and eval data; judging only refusals; ignoring confidence intervals.

## Verification
Reproduce results, validate graders, inspect slice performance, and confirm release criteria against independent evidence.

## Expected output
Versioned evaluation results with methods, uncertainty, slices, severe failures, and release recommendation.

## Stop conditions
Escalate when evaluation validity is compromised or evidence is insufficient for a safety claim.