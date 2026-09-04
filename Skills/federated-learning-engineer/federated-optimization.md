# Federated Optimization

## Purpose
Design and tune optimization for distributed, partially participating, non-IID clients while controlling convergence, communication cost, and instability.

## When to use
Use when selecting or tuning FedAvg-style training, diagnosing oscillation or divergence, or comparing server/client optimizers.

## Inputs
Model, client data characteristics, local batch sizes, client learning rates, local steps, server optimizer, participation rate, communication budget, and convergence metrics.

## Context to inspect
Inspect data heterogeneity, gradient variance, client drift, stale updates, optimizer state placement, and whether local training objectives differ.

## Core knowledge
Local computation reduces communication but increases client drift. Server momentum/adaptive optimizers can improve convergence but introduce additional state and tuning. Hyperparameters interact strongly with participation and heterogeneity.

## Procedure
1. Establish centralized and local-only baselines.
2. Start with a simple FedAvg configuration.
3. Measure loss, update norms, and client-to-client variance.
4. Tune client learning rate and local-step count jointly.
5. Evaluate server momentum or adaptive optimization only when needed.
6. Track convergence per communication round and per byte transferred.
7. Test multiple participation rates and random seeds.
8. Evaluate cohort and tail-client performance.
9. Add gradient/update clipping when justified by instability or privacy requirements.
10. Document the selected operating region and rollback thresholds.

## Decision points
Increase local work when bandwidth dominates and drift remains controlled. Reduce local steps when non-IID drift dominates. Use adaptive server optimization when evidence shows material benefit rather than by default.

## Common failure patterns
- Tuning learning rate without local steps.
- Reporting only final global accuracy.
- Ignoring update-norm explosions.
- Comparing methods with unequal communication budgets.
- Overfitting hyperparameters to one client sample.

## Verification
Verify stability across seeds, client samples, and realistic participation rates; compare quality per round and per communication cost.

## Expected output
A reproducible federated optimization configuration with evidence, trade-offs, and failure thresholds.

## Stop conditions
Stop if training telemetry is insufficient to distinguish optimization failure from data or infrastructure failure.