# Production Causal Decisioning

## Purpose
Turn validated causal estimates into production decisions, targeting rules, and monitoring systems without silently converting uncertain research findings into unsafe automated actions.

## When to use
Use when causal estimates will drive rollout, policy, personalization, budget allocation, treatment assignment, or operational automation.

## Inputs
- Validated causal estimand and uncertainty
- Candidate treatment policy
- Cost, benefit, and safety constraints
- Eligibility and serving features
- Monitoring and rollback capabilities

## Context to inspect
Inspect whether production features match analysis-time features, treatment capacity, latency, fairness constraints, feedback loops, interference, changing assignment mechanisms, and whether outcomes arrive with delay.

## Core knowledge
A statistically identified effect is not automatically a good policy. Decisioning requires policy value, uncertainty, treatment cost, capacity, constraints, off-policy evaluation, guardrails, exploration strategy, and continuous causal validity checks under distribution shift.

## Procedure
1. Translate the causal estimate into a concrete decision rule and utility function.
2. Include treatment costs, harms, capacity, and uncertainty explicitly.
3. Verify all serving-time features are pre-treatment and available without leakage.
4. Compare the proposed policy with simple business and risk-based baselines.
5. Estimate policy value on held-out or experimental data where possible.
6. Define eligibility, exclusions, guardrails, and override paths.
7. Roll out through shadow mode, limited cohorts, or randomized holdouts when feasible.
8. Monitor treatment rates, covariate balance, overlap, outcomes, costs, and subgroup effects.
9. Preserve a control or exploration mechanism sufficient for ongoing learning when ethical.
10. Detect assignment-policy drift and feedback loops.
11. Define rollback thresholds before deployment.
12. Re-estimate effects after material population, product, or policy changes.
13. Record decisions, assumptions, model versions, and evidence for auditability.

## Decision points
Prefer fixed rules when heterogeneity evidence is weak. Use personalized policies only when incremental value is robust out of sample. Preserve randomized holdouts when the cost is acceptable and ongoing causal learning matters.

## Common failure patterns
- Deploying CATE rankings without policy evaluation
- Analysis/serving feature mismatch
- No persistent control group
- Ignoring treatment capacity and costs
- Feedback loops destroy overlap
- Monitoring prediction metrics but not causal assumptions
- No rollback criteria

## Verification
Verify policy value, guardrail behavior, feature timing, serving parity, subgroup outcomes, treatment overlap, logging completeness, and rollback execution through staged deployment evidence.

## Expected output
A production decision policy with value analysis, constraints, rollout plan, causal monitoring, audit trail, and rollback thresholds.

## Stop conditions
Stop deployment when serving data cannot reproduce the validated causal setup, policy value is not robust, safety constraints are unresolved, or monitoring cannot detect harmful causal drift.