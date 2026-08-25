# Bias, Fairness, and Exposure Quality

## Purpose
Detect and mitigate systematic recommendation harms caused by unequal relevance, exposure, or feedback dynamics.

## When to use
Use during design, evaluation, major model changes, marketplace tuning, or when exposure disparities are reported.

## Inputs
Ranking outputs, exposure logs, relevant cohort/item attributes permitted for analysis, utility metrics, and policy requirements.

## Context to inspect
Popularity concentration, provider exposure, user utility by cohort, label quality, historical bias, and legal/privacy constraints.

## Core knowledge
Fairness definitions can conflict. Exposure parity is not always utility parity. Recommenders amplify historical feedback and position bias, so evaluate both consumer and provider effects where relevant.

## Procedure
1. Identify stakeholders and plausible harm mechanisms.
2. Define permitted, decision-relevant fairness measurements.
3. Establish baseline utility and exposure distributions.
4. Separate eligibility/relevance differences from ranking effects.
5. Test model and re-ranking alternatives.
6. Quantify utility cost and fairness benefit by cohort.
7. Add monitoring for drift and concentration.
8. Document governance and escalation ownership.

## Decision points
Use hard constraints for policy obligations; calibrated re-ranking for measured exposure goals; avoid collecting sensitive attributes without legitimate authorization.

## Common failure patterns
Single fairness metric, aggregate-only analysis, proxy discrimination, fairness washing, collecting unnecessary sensitive data, and ignoring provider-side effects.

## Verification
Recompute metrics independently, inspect confidence intervals and cohorts, validate constraints, and review unintended utility shifts.

## Expected output
A documented fairness assessment and mitigation with measurable trade-offs.

## Stop conditions
Stop when required analysis would violate privacy/legal constraints or fairness objectives lack accountable governance.