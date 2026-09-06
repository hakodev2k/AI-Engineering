# Quantitative Experiment Design

## Purpose
Design controlled studies that estimate how an AI interaction or product change affects user behavior or outcomes while minimizing confounding and analytical flexibility.

## When to use
Use for comparing interfaces, explanation strategies, automation levels, prompting supports, or other manipulable conditions when a causal estimate is required.

## Inputs
Hypothesis, primary outcome, candidate conditions, target population, expected effect, variance estimates, system configuration, and risk constraints.

## Context to inspect
Inspect prior studies, metric reliability, task distribution, model variability, learning effects, randomization feasibility, and interference between participants or conditions.

## Core knowledge
Randomization supports causal inference when assignment, measurement, attrition, and analysis are handled correctly. AI systems introduce repeated stochastic variation that may require hierarchical or repeated-measures thinking. Statistical significance is not equivalent to practical value.

## Procedure
1. Define the causal question and treatment precisely.
2. Select one or a small number of primary outcomes tied to the decision.
3. Define meaningful effect size and power assumptions before collection.
4. Choose within- or between-subject assignment based on carryover risk.
5. Randomize order or condition where appropriate.
6. Standardize or record model and task variables that affect outcomes.
7. Predefine exclusion, missing-data, and analysis rules.
8. Pilot instrumentation and manipulation strength.
9. Run the study without changing conditions midstream unless documented as a new phase.
10. Estimate effects with uncertainty intervals and practical significance.
11. Examine pre-specified heterogeneity where decision-relevant.
12. Report deviations and limitations.

## Decision points
Use within-subject designs for efficiency when carryover is manageable; between-subject when learning or contamination is severe. Increase repeated trials when output stochasticity materially affects measurement.

## Common failure patterns
Underpowered studies, multiple unplanned outcomes, peeking and stopping on significance, uncontrolled model changes, ignoring order effects, and interpreting non-significance as equivalence.

## Verification
Confirm randomization integrity, manipulation delivery, metric quality, sample accounting, and reproducible analysis. Separate observed effect from business interpretation.

## Expected output
An experiment protocol and analysis containing causal estimand, design, sample rationale, measures, uncertainty, practical effect, limitations, and decision recommendation.

## Stop conditions
Stop when randomization is unethical or impossible for the required claim, sample size cannot support useful inference, or treatment exposes users to unacceptable risk.