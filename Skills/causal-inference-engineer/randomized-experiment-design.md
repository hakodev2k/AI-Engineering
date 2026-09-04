# Randomized Experiment Design

## Purpose
Design experiments that identify causal effects with adequate power, valid randomization, operational safety, and interpretable estimands.

## When to use
Use when intervention assignment can be randomized directly or by cluster, time block, geography, or other operational unit.

## Inputs
- Intervention and comparator
- Primary outcome and effect size of interest
- Eligible population
- Randomization unit
- Operational constraints
- Historical variance or baseline rates

## Context to inspect
Inspect interference, noncompliance, attrition, ramp-up effects, repeated measures, cluster structure, instrumentation, and exposure logging.

## Core knowledge
Know randomization inference, power, minimum detectable effect, cluster design effects, stratification, covariate adjustment, intent-to-treat, per-protocol risks, sequential monitoring, and multiple testing.

## Procedure
1. Define the primary estimand before launch.
2. Select the randomization unit to minimize contamination.
3. Choose allocation ratio and stratification/blocking variables.
4. Calculate sample size or runtime using realistic variance and effect assumptions.
5. Predefine primary, guardrail, and secondary outcomes.
6. Specify treatment exposure and noncompliance handling.
7. Validate assignment implementation with an A/A or randomization audit.
8. Define stopping and monitoring rules before observing treatment effects.
9. Plan ITT analysis as the default.
10. Predefine subgroup and multiplicity handling.
11. Instrument exposure, eligibility, and outcome timestamps.
12. Run balance, sample-ratio-mismatch, attrition, and contamination diagnostics.

## Decision points
Use cluster randomization when unit-level assignment causes spillovers. Use stratification when strong prognostic factors can improve precision. Avoid optional stopping unless a valid sequential design is specified.

## Common failure patterns
- Underpowered tests
- Mid-experiment metric changes
- Sample-ratio mismatch ignored
- Analyzing only compliers
- Peeking and stopping on significance
- Interference across treatment arms

## Verification
Verify allocation integrity, balance, exposure logging, sample-ratio tests, predeclared analysis, and confidence intervals for the primary estimand.

## Expected output
Experiment protocol, power analysis, randomization plan, analysis plan, diagnostics, and decision criteria.

## Stop conditions
Stop launch if assignment cannot be audited, safety guardrails are missing, interference destroys the intended randomization, or primary outcomes cannot be measured reliably.