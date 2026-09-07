# Training Stability Debugging

## Purpose
Diagnose post-training runs that diverge, stall, become numerically unstable, or produce behavioral collapse, using evidence rather than blind hyperparameter changes.

## When to use
Use for non-finite loss/gradients, abrupt reward or KL shifts, loss spikes, throughput anomalies, checkpoint-to-checkpoint behavioral collapse, or unexplained failure to learn.

## Inputs
Training logs, metric histories, optimizer state, configuration, data versions, checkpoints, hardware/runtime logs, and a reproducible failing window when possible.

## Preconditions
Metrics are timestamped/versioned well enough to correlate code, data, and infrastructure changes.

## Context to inspect
Inspect learning rate schedule, effective batch size, precision/scaler state, gradient norms, clipping, optimizer parameters, sequence lengths, masking, data outliers, distributed synchronization, checkpoint restore behavior, and recent code/config changes.

## Core knowledge
Instability can originate in numerics, optimization, data, implementation, distributed systems, or objective design. Symptoms are often downstream: a loss spike may be caused by malformed batches, a reward surge by normalization bugs, and behavior collapse by excessive policy drift. Senior debugging narrows causality with controlled reproduction and one-variable changes.

## Procedure
1. Mark the first observable divergence, not the final crash.
2. Compare the failing run against the nearest known-good configuration.
3. Align logs by optimizer step and data shard.
4. Inspect loss, gradient norm, learning rate, reward/KL, entropy, scaler, sequence length, and throughput around the onset.
5. Re-run the suspect interval with deterministic data ordering where feasible.
6. Decode and inspect anomalous batches, including masks and token counts.
7. Validate optimizer/checkpoint restoration and step counters.
8. Test numerical precision issues with a safer precision or reduced scale on a small run.
9. Reduce learning rate/update magnitude only after ruling out data or implementation faults.
10. Check distributed ranks for desynchronization, OOM recovery, or dropped batches.
11. Bisect recent code/data/config changes when the failure is new.
12. Reproduce the fix in a small experiment before restarting the expensive run.
13. Add assertions/telemetry that would detect recurrence earlier.

## Decision points
Prefer rollback/bisection when a previously stable recipe breaks; prefer hyperparameter exploration when the regime is genuinely new. Treat recurring batch-specific failures as data/preprocessing issues before blaming the optimizer. Preserve failing artifacts for analysis rather than deleting them to free space prematurely.

## Common failure patterns
Changing several hyperparameters simultaneously; restarting without identifying onset; ignoring data shards; assuming OOM recovery is lossless; comparing runs with different effective batch sizes; trusting aggregate loss without gradient/reward telemetry.

## Verification
Reproduce the original failure in a bounded test when possible, demonstrate that the isolated fix removes it, and show expected metrics remain stable beyond the previous failure point. Confirm final behavior evaluations recover.

## Expected output
A root-cause report, minimal corrective change, evidence from reproduction, added monitoring/assertions, and a safe restart configuration.

## Stop conditions
Stop and escalate when corruption affects checkpoints/data, hardware faults are suspected across nodes, the failure cannot be reproduced with available evidence, or continuing would consume substantial compute without narrowing causality.