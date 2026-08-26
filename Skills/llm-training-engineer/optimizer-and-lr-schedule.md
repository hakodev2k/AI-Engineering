# Optimizer and Learning-Rate Schedule

## Purpose
Select and tune optimizer hyperparameters and schedules for stable, compute-efficient convergence.

## When to use
Use for new model scales, changed batch sizes/data mixtures, continued pretraining, or unexplained convergence regressions.

## Inputs
Model scale, global batch, token budget, optimizer implementation, baseline hyperparameters, gradient statistics, loss curves, precision mode.

## Context to inspect
Warmup, peak/min learning rate, decay shape, betas, epsilon, weight decay exclusions, gradient clipping, batch scaling assumptions, and optimizer-state precision.

## Core knowledge
Optimizer settings interact with batch size, architecture, normalization, precision, and training horizon. Hyperparameters that work at one scale may not transfer directly. Stable loss is necessary but insufficient; downstream quality matters.

## Procedure
1. Reproduce a known stable baseline.
2. Verify parameter groups and weight-decay exclusions.
3. Choose initial LR using prior scaling evidence.
4. Define warmup and decay against total training tokens.
5. Log gradient norm, update norm, LR, loss and overflow events.
6. Run bounded sweeps at smaller scale when uncertainty is high.
7. Inspect early instability and late undertraining.
8. Compare downstream evaluations at matched token counts.
9. Freeze optimizer config and implementation version.

## Decision points
Increase warmup for unstable early training; reduce peak LR when update spikes persist; change optimizer only when evidence shows a meaningful stability/efficiency benefit. Avoid changing several coupled hyperparameters simultaneously without an experiment design.

## Common failure patterns
Schedule based on steps while batch size changes; accidental weight decay on normalization/bias terms; tuning to one noisy run; comparing checkpoints at unequal tokens.

## Verification
Training is numerically stable, update statistics remain within expected ranges, controlled runs reproduce trends, and downstream quality improves or remains within guardrails.

## Expected output
Versioned optimizer/schedule configuration with tuning evidence and monitored stability bounds.

## Stop conditions
Stop on persistent divergence, unexplained gradient spikes, optimizer-state corruption, or irreproducible sweep results.