# Federated Fairness

## Purpose
Assess and improve fairness across clients and meaningful cohorts without assuming that optimizing average global quality produces equitable outcomes.

## When to use
Use when client populations differ materially, regulators or product requirements impose fairness constraints, or tail clients underperform.

## Inputs
Per-client or privacy-safe cohort metrics, sampling policy, aggregation weights, client sizes, model outputs, fairness objectives, and protected-attribute governance rules.

## Context to inspect
Inspect representation in participation, data quantity, label prevalence, local quality, personalization effects, and whether cohort definitions are lawful and operationally meaningful.

## Core knowledge
Federated fairness can concern equal client utility, group fairness, participation fairness, or resource fairness. These objectives can conflict with sample-weighted accuracy and with each other.

## Procedure
1. Define the fairness objective and population it protects.
2. Verify lawful access to required attributes or approved proxies.
3. Measure participation and model-quality disparities.
4. Separate data scarcity, distribution shift, and optimization effects.
5. Evaluate whether weighting, sampling, personalization, or targeted data improvements address the root cause.
6. Test interventions against global utility and other cohorts.
7. Measure tail-client outcomes and uncertainty.
8. Avoid exposing sensitive per-client metrics unnecessarily.
9. Define fairness guardrails for model promotion.
10. Monitor drift after deployment.

## Decision points
Use sampling changes for representation problems, objective/aggregation changes for optimization imbalance, and personalization for stable local-domain differences. Do not use a single fairness metric as a universal target.

## Common failure patterns
- Fairness defined only as equal sample contribution.
- Sensitive cohorts inferred without governance.
- Improving one cohort while silently harming another.
- Ignoring participation bias.
- No uncertainty around small cohorts.

## Verification
Verify disparity metrics, intervention causality as far as practical, global trade-offs, and compliance with attribute-governance rules.

## Expected output
A fairness assessment with defined objective, evidence, interventions, trade-offs, guardrails, and monitoring plan.

## Stop conditions
Stop if fairness objectives are undefined, required attributes cannot be used lawfully, or metrics are too sparse to support reliable conclusions.