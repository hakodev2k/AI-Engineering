# Experiment Design and Reproducibility

## Purpose
Run vision experiments whose results can be attributed to deliberate changes, reproduced later, and compared without hidden data or environment differences.

## When to use
Use for architecture, augmentation, loss, optimizer, resolution, data, or serving experiments that influence model selection.

## Inputs
Hypothesis, baseline configuration, dataset versions, code revision, environment, compute budget, evaluation protocol, and experiment tracker.

## Preconditions
A reproducible baseline and immutable evaluation data exist.

## Context to inspect
Inspect random seeds, nondeterministic kernels, mixed precision, distributed settings, checkpoint loading, dataset manifests, preprocessing versions, library/CUDA versions, and metric code.

## Core knowledge
Vision results can vary materially across seeds and infrastructure. Reproducibility requires lineage across code, data, model initialization, configuration, runtime, and evaluation—not just a saved checkpoint.

## Procedure
1. State one falsifiable hypothesis and target metric.
2. Snapshot code, configuration, data manifest, and environment.
3. Reproduce the baseline before modifying it.
4. Change the minimum number of variables necessary.
5. Keep train/validation/test boundaries fixed.
6. Record seeds, hardware, precision, and distributed settings.
7. Log learning curves, resource usage, and checkpoints.
8. Run enough seeds or repeats to assess noisy improvements.
9. Compare slice metrics and error categories, not only aggregate score.
10. Perform ablations when multiple mechanisms changed.
11. Retain artifacts necessary to rerun the winning configuration.
12. Promote a change only when evidence exceeds expected variance and operational cost is acceptable.

## Decision points
Use broad sweeps for poorly understood hyperparameters; targeted experiments when a failure hypothesis is specific. Spend repeated-run budget on close decisions, not obviously inferior candidates.

## Common failure patterns
Comparing runs on different data revisions, undocumented defaults, keeping only the best seed, changing evaluation code mid-study, and attributing gains to architecture when preprocessing also changed.

## Verification
Verify the baseline and chosen result can be rerun from recorded artifacts with expected metric tolerance and identical dataset identity.

## Expected output
An experiment record containing hypothesis, lineage, controlled comparison, variance evidence, resource cost, and decision.

## Stop conditions
Stop if the baseline cannot be reproduced, lineage is incomplete, evaluation data changed unexpectedly, or compute cost exceeds the agreed experiment budget.