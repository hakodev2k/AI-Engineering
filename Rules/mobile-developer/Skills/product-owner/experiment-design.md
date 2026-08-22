# Product Experiment Design

## Purpose
Reduce product uncertainty through controlled, measurable experiments before or during incremental delivery.

## When to use
Use when important assumptions about desirability, usability, viability, or behavior can be tested more cheaply than full implementation.

## Inputs
Hypothesis, target users, baseline evidence, risk, candidate intervention, metrics, and operational constraints.

## Context to inspect
Inspect current behavior, sample availability, instrumentation, confounders, ethical constraints, and release controls.

## Core knowledge
An experiment should test a falsifiable assumption. Not every product change requires an A/B test; prototypes, concierge tests, fake doors, usability studies, or phased rollouts may answer the decision faster.

## Procedure
1. State the decision the experiment will inform.
2. Write the hypothesis and falsification condition.
3. Identify the riskiest assumption.
4. Choose the cheapest credible test.
5. Define target population and success metrics.
6. Set duration or evidence threshold before starting.
7. Identify guardrails and ethical risks.
8. Run without changing success criteria midstream.
9. Analyze results and uncertainty.
10. Decide to proceed, adapt, retest, or stop.

## Decision points
Use controlled experiments for causal questions with sufficient traffic; use qualitative or prototype tests for early usability and problem uncertainty.

## Common failure patterns
Testing multiple unknowns at once, declaring success from tiny samples, changing metrics after results appear, shipping experiments without cleanup, and interpreting engagement as value automatically.

## Verification
The result can change a product decision, metrics were defined beforehand, and limitations are documented.

## Expected output
An experiment brief, evidence, interpretation, and explicit product decision.

## Stop conditions
Stop when experimentation risks user harm, violates policy, lacks adequate measurement, or cannot produce decision-relevant evidence.