# Retraining Strategy

## Purpose
Define when and how models should be retrained without turning every data change into uncontrolled production churn.

## When to use
For production systems whose data or target relationships evolve.

## Inputs
Drift signals, label availability, retraining cost, model decay history, release policy, business seasonality.

## Context to inspect
Data freshness, feedback delay, pipeline reliability, previous retraining outcomes, approval requirements, rollback capability.

## Core knowledge
Retraining can amplify broken or poisoned data. Triggering should reflect observed degradation or justified freshness requirements and must retain evaluation gates.

## Procedure
1. Characterize expected model decay and seasonality.
2. Choose candidate triggers: schedule, data volume, drift, quality degradation, or event.
3. Define minimum fresh-data and label requirements.
4. Reuse versioned training/evaluation pipelines.
5. Compare candidate against current production model on stable and recent windows.
6. Apply quality, fairness, latency, and cost gates.
7. Promote progressively with rollback.
8. Record retraining cause and outcome.

## Decision points
Use scheduled retraining for predictable drift; signal-driven retraining when reliable labels/monitoring exist; manual approval for high-impact models.

## Common failure patterns
Retraining on every drift alert, automatic promotion, training on incomplete labels, and forgetting seasonal validation.

## Verification
Historical replay shows trigger/gates would have handled known degradation appropriately; candidate must beat promotion criteria.

## Expected output
A retraining trigger, validation, promotion, and rollback policy.

## Stop conditions
Do not retrain/promote when source data integrity or evaluation gates fail.