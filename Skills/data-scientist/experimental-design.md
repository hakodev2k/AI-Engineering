# Experimental Design

## Purpose
Design controlled experiments that estimate decision-relevant treatment effects with sufficient validity and power.

## When to use
Use when a product, policy, algorithm, or process change can be randomized or otherwise experimentally controlled.

## Inputs
Intervention, target population, primary outcome, unit of randomization, baseline rates, minimum detectable effect, constraints, and risks.

## Context to inspect
Exposure mechanics, interference, seasonality, novelty effects, instrumentation, eligibility, and operational rollout.

## Core knowledge
Randomization protects against confounding only when assignment and analysis remain valid. Power depends on variance, effect size, allocation, clustering, and repeated measures. Guardrails protect against harmful wins.

## Procedure
1. Define hypothesis and primary estimand.
2. Choose experimental unit and eligibility criteria.
3. Select primary, secondary, and guardrail metrics.
4. Estimate sample size and duration before launch.
5. Define randomization, stratification, and exposure logging.
6. Check interference, contamination, and carryover risks.
7. Predefine stopping and analysis rules.
8. Validate instrumentation with an A/A or dry run when warranted.
9. Monitor integrity without repeatedly peeking for significance.
10. Analyze intention-to-treat first and investigate heterogeneous effects carefully.

## Decision points
Use cluster randomization when individual treatment causes interference. Prefer sequential methods only with a valid sequential design, not informal repeated testing.

## Common failure patterns
Metric switching, underpowered tests, sample-ratio mismatch, peeking, post-treatment filtering, novelty bias, and ignoring guardrail regressions.

## Verification
Validate assignment balance, exposure, sample ratio, metric integrity, planned duration, and reproducible analysis.

## Expected output
An experiment protocol and analysis with effect estimates, uncertainty, integrity checks, and recommendation.

## Stop conditions
Do not launch when ethical, safety, instrumentation, or sample-size requirements cannot be satisfied.