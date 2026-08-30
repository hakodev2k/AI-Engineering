# Safety Experimentation Rules

## Purpose
Allow trust-and-safety changes to be tested without exposing users to uncontrolled harm or interpreting engagement gains as safety success.

## Scope
Applies to A/B tests, holdouts, shadow evaluation, staged rollouts, threshold experiments, and policy-control experiments.

## MUST
- Experiments affecting safety controls MUST define the safety hypothesis, target population, primary metrics, guardrails, stop conditions, and maximum exposure.
- Severe-harm protections MUST NOT be intentionally withheld from control groups unless the risk is explicitly reviewed and an equivalent safe design is approved.
- Experiments MUST monitor both desired safety outcomes and adverse effects such as false positives, appeals, complaints, evasion, and review burden.
- Assignment and analysis MUST prevent contamination that makes treatment effects uninterpretable.
- High-risk experiments MUST use staged exposure and rapid rollback capability.
- Conclusions MUST distinguish statistically uncertain results, operational anomalies, and causal evidence.

## MUST NOT
- MUST NOT optimize for engagement, conversion, or cost while ignoring defined safety guardrails.
- MUST NOT continue an experiment after a preapproved severe-harm stop condition is met.
- MUST NOT treat offline detector improvement as proof of safer user outcomes.
- MUST NOT expose sensitive detection thresholds or treatment details to participants when disclosure materially enables evasion.

## SHOULD
- Shadow mode SHOULD be used before live enforcement when feasible.
- Experiments SHOULD predefine segmentation for cohorts likely to experience different safety impact.
- Long-term or network effects SHOULD be assessed when short experiments cannot capture them.

## Exceptions
Urgent incident mitigation MAY bypass experimentation and deploy directly when delay creates greater risk. The change MUST still be monitored and reviewed after stabilization.

## Verification
Review experiment plans, guardrails, assignment logic, stop-condition alerts, exposure ramps, rollback tests, and analysis notebooks or reports. Confirm severe-harm protections were not knowingly removed without explicit approval.