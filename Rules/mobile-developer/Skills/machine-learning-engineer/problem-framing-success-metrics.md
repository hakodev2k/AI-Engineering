# Problem Framing and Success Metrics

## Purpose
Translate a business problem into a feasible ML task with measurable value and explicit constraints.

## When to use
Before datasets, model selection, experiments, or major model redesigns.

## Inputs
Business objective, users, candidate decisions, available data, constraints, baseline process, cost of errors.

## Context to inspect
Current workflow, labels, decision latency, feedback loops, legal constraints, serving environment, and non-ML alternatives.

## Core knowledge
A strong ML metric must connect to an operational decision. Offline accuracy alone rarely proves business value. Establish a non-ML baseline and distinguish prediction quality from product outcomes.

## Procedure
1. Define the decision the model will influence.
2. Identify prediction target, unit, horizon, and consumers.
3. Define positive/negative error costs.
4. Establish business and technical baselines.
5. Select primary and guardrail metrics.
6. Define acceptable latency, cost, reliability, privacy, and interpretability constraints.
7. Test whether sufficient labels and feedback exist.
8. Document assumptions and experiment exit criteria.

## Decision points
Prefer rules or analytics when the problem is deterministic, data is inadequate, or ML adds little incremental value. Choose metrics based on class balance and error cost rather than convention.

## Common failure patterns
Optimizing a proxy disconnected from value, label leakage in the target definition, ignoring intervention effects, and accepting vague success criteria.

## Verification
Stakeholders can explain what decision changes if the model improves; baseline, target, constraints, and acceptance thresholds are testable.

## Expected output
An ML problem statement, baselines, metric contract, constraints, and go/no-go criteria.

## Stop conditions
Stop when the target cannot be observed, requirements conflict materially, or no responsible decision owner exists.