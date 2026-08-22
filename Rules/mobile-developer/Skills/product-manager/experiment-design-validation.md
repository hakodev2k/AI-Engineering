# Experiment Design and Validation

## Purpose
Design product experiments that reduce uncertainty and support defensible decisions without overclaiming causality.

## When to use
Use for uncertain value propositions, onboarding changes, pricing hypotheses, behavior changes, and risky product bets.

## Inputs
Hypothesis, target population, baseline metrics, expected effect, constraints, instrumentation, and risk guardrails.

## Context to inspect
Inspect historical variance, traffic, segmentation, seasonality, concurrent changes, experiment platform limits, and ethical considerations.

## Core knowledge
Experiments require a falsifiable hypothesis, appropriate comparison, sufficient exposure, predefined metrics, and disciplined interpretation. Statistical significance alone does not imply meaningful product value.

## Procedure
1. State the decision and falsifiable hypothesis.
2. Define treatment, control or alternative comparison.
3. Select primary metric, secondary diagnostics, and guardrails.
4. Define eligible population and exclusions.
5. Estimate detectable effect and required duration with analytics support.
6. Validate instrumentation before launch.
7. Predefine stopping and interpretation rules.
8. Run without peeking-driven decisions.
9. Analyze effect size, uncertainty, segments, and guardrails.
10. Decide ship, iterate, reject, or gather more evidence.

## Decision points
Use A/B tests when randomization and traffic are practical. Use prototypes, staged rollouts, quasi-experiments, or qualitative tests when they answer the uncertainty more cheaply or safely.

## Common failure patterns
Testing without a decision, changing metrics mid-test, underpowered experiments, ignoring novelty effects, and shipping on significance despite harmful guardrails.

## Verification
Assignment and telemetry are valid; analysis follows predefined rules; conclusions match evidence strength.

## Expected output
Experiment brief, result interpretation, decision, limitations, and follow-up actions.

## Stop conditions
Stop when experimentation creates unacceptable risk, sample assumptions fail, or instrumentation cannot support trustworthy inference.