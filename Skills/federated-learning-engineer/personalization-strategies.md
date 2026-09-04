# Personalization Strategies

## Purpose
Design federated personalization so a shared model benefits from cross-client learning while adapting to local distributions and constraints.

## When to use
Use when one global model performs unevenly across clients, local domains differ materially, or users/sites need customized behavior.

## Inputs
Global model, per-client evaluation, client data volumes, local compute budget, privacy constraints, personalization latency, and deployment model.

## Context to inspect
Inspect whether heterogeneity is persistent or temporary, whether local labels are available, model storage constraints, cold-start behavior, and whether personalization state may leave the client.

## Core knowledge
Personalization can use local fine-tuning, partial parameter sharing, clustered FL, meta-learning, adapters, or multi-task formulations. More personalization improves local fit but can reduce maintainability and shared generalization.

## Procedure
1. Quantify global-model gaps by client and cohort.
2. Separate data scarcity from true domain heterogeneity.
3. Establish local fine-tuning as a simple baseline.
4. Decide which parameters may remain global versus local.
5. Test regularization against overfitting to small local datasets.
6. Evaluate cold-start and low-participation clients.
7. Compare personalization benefit against added storage, compute, and lifecycle complexity.
8. Define model/version compatibility between global and local state.
9. Add privacy-safe local evaluation.
10. Define reset and rollback behavior for corrupted local state.

## Decision points
Prefer local fine-tuning when enough local data and compute exist. Use clustered/shared representations when domains form stable groups. Keep a single global model when personalization gains are marginal.

## Common failure patterns
- Personalizing tiny clients until they overfit.
- No global fallback.
- Local state incompatible after global upgrades.
- Measuring only average improvement.
- Treating transient drift as permanent identity.

## Verification
Verify gains per cohort, cold-start behavior, upgrade compatibility, and that personalization does not violate privacy or resource budgets.

## Expected output
A personalization design with method, local/global parameter boundaries, evaluation results, lifecycle rules, and rollback plan.

## Stop conditions
Stop if per-client benefit cannot be measured, local state handling is undefined, or personalization creates unacceptable privacy or maintenance risk.