# Experiment Hypothesis Design

## Purpose
Turn a resilience concern into a falsifiable experiment with clear expected behavior, evidence, and risk boundaries.

## When to use
Use before executing any chaos experiment, when a proposed test is vague, or when teams want to validate an architectural resilience claim.

## Inputs
Risk statement, architecture context, steady-state definition, dependency map, SLOs, incident history, and candidate perturbation.

## Preconditions
The system boundary and protected user outcome are known.

## Context to inspect
Redundancy assumptions, failover mechanisms, timeouts, retry behavior, autoscaling, circuit breakers, queues, data consistency rules, and operational runbooks.

## Core knowledge
A strong hypothesis links a specific adverse condition to an expected observable outcome. It should state what the system is expected to preserve, what recovery behavior is acceptable, and what evidence would falsify the claim. Hypotheses should test uncertainty, not merely demonstrate known behavior.

## Procedure
1. State the resilience claim in plain language.
2. Identify the architectural assumption behind it.
3. Define the perturbation needed to challenge that assumption.
4. Define the steady-state condition that should remain true.
5. Define acceptable transient degradation.
6. Define recovery expectations and time bounds.
7. Identify evidence that would falsify the claim.
8. Document confounding factors.
9. Confirm the experiment is narrow enough to attribute outcomes.
10. Review with service owners before execution.

## Decision points
Prefer one primary hypothesis per experiment. Split experiments when multiple independent failure mechanisms would make attribution ambiguous.

## Common failure patterns
Writing goals instead of falsifiable hypotheses; using undefined terms such as resilient; changing multiple variables at once; ignoring recovery time; and defining success so broadly that almost any outcome passes.

## Verification
Confirm the hypothesis contains a perturbation, expected outcome, measurement method, and explicit falsification criteria.

## Expected output
A concise experiment hypothesis with measurable success and failure conditions.

## Stop conditions
Stop when the expected behavior cannot be stated clearly or when required evidence cannot be observed safely.