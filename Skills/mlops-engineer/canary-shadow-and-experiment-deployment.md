# Canary, Shadow, and Experiment Deployment

## Purpose
Expose a new model to production traffic progressively while limiting blast radius and collecting trustworthy comparative evidence.

## When to use
Use for model replacements with meaningful behavioral, latency, cost, or risk uncertainty.

## Inputs
Candidate/baseline versions, routing controls, metrics, guardrails, traffic segments, rollback criteria, experiment duration.

## Preconditions
Offline validation passed and traffic can be attributed by model version.

## Context to inspect
Gateway/router, experiment framework, feature consistency, logging, user/session assignment, privacy constraints, and rollback mechanics.

## Core knowledge
Shadowing observes without affecting outcomes; canaries affect a controlled fraction; A/B experiments estimate causal product impact. Assignment and metric attribution must avoid contamination.

## Procedure
1. State deployment hypothesis and risk.
2. Choose shadow, canary, or randomized experiment.
3. Define eligibility and stable assignment.
4. Set guardrail and success metrics.
5. Verify feature/input parity between variants.
6. Start at minimal safe exposure.
7. Monitor technical and model metrics by version.
8. Increase exposure only after evidence windows pass.
9. Roll back automatically/manual per predefined criteria.
10. Record decision and final evidence.

## Decision points
Shadow when side effects must be zero; canary for operational safety; A/B when product impact requires causal measurement.

## Common failure patterns
Changing multiple variables, unstable assignment, contaminated caches, insufficient sample, ignoring tail risk, and rollback criteria invented after metrics degrade.

## Verification
Confirm routing percentages, assignment stability, model-version attribution, guardrails, and rollback execution in a controlled test.

## Expected output
Rollout plan, experiment design, thresholds, dashboards, rollback procedure, and decision record.

## Stop conditions
Stop exposure on safety/security signals, broken attribution, statistically invalid setup, or exceeded guardrails.