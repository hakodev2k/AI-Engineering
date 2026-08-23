# Hypothesis-Driven Investigation

## Purpose
Investigate incidents efficiently by converting observations into testable hypotheses and eliminating causes with evidence.

## When to use
Use when the failure cause is uncertain, multiple systems are involved, or responders risk random troubleshooting.

## Inputs
Symptoms, timeline, telemetry, recent changes, architecture, dependency state, reproduction attempts, and known-good baselines.

## Context to inspect
Inspect temporal correlations, component boundaries, resource saturation, error distributions, deployment history, configuration, and dependency behavior.

## Core knowledge
Correlation is not causation. Strong hypotheses predict additional observable evidence. Senior responders rank hypotheses by explanatory power, likelihood, impact, and cost of testing.

## Procedure
1. Write the observed symptoms as facts.
2. Establish a precise failure window and baseline.
3. Generate a small set of plausible causes.
4. For each hypothesis, state evidence that should exist if true and if false.
5. Rank tests by information gained versus operational risk.
6. Run one discriminating test or query at a time.
7. Record results and eliminate contradicted hypotheses.
8. Refine remaining hypotheses using new evidence.
9. Separate root cause from contributing conditions and triggers.
10. Stop investigative changes once a safe mitigation is more valuable than further diagnosis.

## Decision points
Prefer observational tests over production mutation. Use controlled experiments only when risk is bounded and evidence cannot otherwise discriminate causes.

## Common failure patterns
Confirmation bias, changing several variables, treating absence of logs as proof, overfitting to recent deployments, and keeping disproven hypotheses alive.

## Verification
A leading hypothesis must explain all major symptoms and predict evidence confirmed by at least one independent source.

## Expected output
An investigation log of hypotheses, predictions, tests, evidence, eliminated causes, and current confidence.

## Stop conditions
Stop or escalate when testing could worsen impact, evidence requires unauthorized access, or recovery is being delayed without proportional diagnostic value.