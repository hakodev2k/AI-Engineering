# Online Evaluation and A/B Testing

## Purpose
Measure AI system impact with real users while controlling rollout risk and separating product outcomes from offline proxy metrics.

## When to use
Use after offline qualification when a candidate needs production validation, when user behavior is the decisive quality signal, or when offline metrics poorly predict product value.

## Inputs
- Qualified baseline and candidate
- Product outcome metrics
- Guardrail metrics
- Traffic allocation constraints
- Experiment duration and power assumptions

## Context to inspect
Inspect exposure unit, assignment logic, user cohorts, novelty effects, logging completeness, concurrent experiments, rollback controls, and privacy requirements.

## Core knowledge
Online experiments require stable randomization, predefined metrics, guardrails, adequate power, and exposure accounting. User engagement alone is not necessarily quality; safety, latency, cost, complaint, and retention signals may be needed.

## Procedure
1. Define the primary hypothesis and minimum meaningful effect before launch.
2. Select primary outcome, secondary diagnostics, and hard guardrails.
3. Choose assignment unit to avoid interference and contamination.
4. Estimate sample size and duration using realistic baseline rates.
5. Validate experiment telemetry and cohort assignment in shadow or low-traffic mode.
6. Start with limited exposure when operational risk warrants it.
7. Monitor severe guardrails continuously without repeatedly peeking at noisy success metrics.
8. Analyze the predeclared primary metric and critical slices.
9. Check novelty, carryover, bot, and cohort effects.
10. Combine online evidence with offline failure analysis before promotion.
11. Archive experiment configuration and results for future comparison.

## Decision points
Use A/B testing when randomization is feasible; use phased rollout with matched analysis when it is not. Stop early for severe harm, not merely because an interim success metric looks favorable.

## Common failure patterns
- Changing metrics after seeing results
- User-level contamination across variants
- Ignoring safety or cost guardrails
- Underpowered experiments
- Treating clicks as universal quality

## Verification
Verify randomization balance, exposure counts, telemetry integrity, confidence intervals, and that conclusions reproduce from raw experiment data.

## Expected output
A production experiment report with hypothesis, assignment, metrics, uncertainty, guardrails, slice analysis, and promotion decision.

## Stop conditions
Stop when assignment is corrupted, guardrails breach unacceptable limits, telemetry is incomplete, or experiment exposure creates unapproved user risk.