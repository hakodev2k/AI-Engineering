# Marketing Experimentation

## Purpose
Design and interpret experiments that reduce uncertainty about marketing messages, offers, audiences, channels, and customer experiences.

## When to use
Use when a decision can be tested with controlled variation and the expected value of learning justifies the cost.

## Inputs
Business question, hypothesis, population, baseline metrics, expected effect, traffic or sample size, implementation capability, and risk constraints.

## Context to inspect
Inspect prior experiments, seasonality, concurrent changes, assignment mechanisms, event quality, sample ratio mismatch, contamination risks, and downstream guardrails.

## Core knowledge
A useful experiment begins with a falsifiable hypothesis and predefined decision rule. Statistical significance alone does not establish business importance. Multiple testing, novelty effects, selection bias, and early stopping can create false wins.

## Procedure
1. State the decision and hypothesis.
2. Choose one primary outcome and necessary guardrails.
3. Define population, unit of randomization, and exclusions.
4. Estimate required sample or test duration using realistic effects.
5. Specify control and treatment precisely.
6. Predefine analysis and stopping rules.
7. QA assignment, exposure, events, and experience.
8. Run without opportunistic changes.
9. Check experiment integrity before outcome analysis.
10. Estimate effect size and uncertainty.
11. Examine meaningful segments cautiously.
12. Decide to ship, iterate, reject, or retest.
13. Store the result and learning.

## Decision points
Use A/B tests when randomization is practical; use geo or time-based designs when it is not. Prefer a smaller number of high-value experiments over a large volume of weak tests.

## Common failure patterns
Vague hypotheses, too many primary metrics, stopping at significance, underpowered tests, changing targeting mid-test, post-hoc segmentation, and declaring no effect when uncertainty is wide.

## Verification
Validate assignment balance, exposure, event quality, sample ratio, duration, guardrails, and reproducibility of the analysis.

## Expected output
An experiment specification, integrity checks, result with uncertainty, decision, and reusable learning.

## Stop conditions
Stop when assignment is broken, the treatment creates unacceptable customer risk, required sample is unattainable, or concurrent changes invalidate interpretation.