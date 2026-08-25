# Online Experimentation

## Purpose
Measure causal product impact of recommendation changes through controlled experiments.

## When to use
Use after offline validation for changes capable of affecting user behavior or business outcomes.

## Inputs
Hypothesis, treatment definition, eligible population, primary metric, guardrails, power assumptions, and rollout controls.

## Context to inspect
Randomization unit, interference risk, existing experiments, metric latency, novelty effects, and ramp infrastructure.

## Core knowledge
A/B tests estimate causal effects under valid randomization. Recommenders can create network, inventory, and feedback interference. Sequential peeking and multiple testing inflate false positives.

## Procedure
1. State hypothesis and minimum detectable effect.
2. Select randomization unit that minimizes contamination.
3. Pre-register primary metric, guardrails, cohorts, and duration.
4. Run an A/A or instrumentation check when needed.
5. Ramp gradually while monitoring severe regressions.
6. Keep treatment stable for the planned window.
7. Analyze effect size, uncertainty, guardrails, and heterogeneous effects.
8. Decide ship, iterate, or rollback using predeclared criteria.

## Decision points
Use user-level randomization for persistent personalization; session/request-level only when carryover is negligible. Use switchbacks for shared-resource interference when appropriate.

## Common failure patterns
Metric peeking, changing treatment mid-test, sample-ratio mismatch, overlapping experiment interference, novelty misread as durable lift, and significance without practical impact.

## Verification
Check assignment integrity, SRM, exposure, metric pipelines, confidence intervals, and post-ramp persistence.

## Expected output
A causal experiment decision with reproducible analysis and rollout recommendation.

## Stop conditions
Stop or rollback on safety/guardrail breach, broken randomization, corrupted telemetry, or material unintended impact.