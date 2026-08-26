# Checkpointing and Resume

## Purpose
Create reliable checkpoints that can recover large training jobs without changing optimization or data-consumption semantics.

## When to use
Use for all long-running distributed training and before changing cluster topology or software versions.

## Inputs
Model/optimizer states, scheduler, RNG states, sampler position, distributed layout, storage bandwidth, recovery objectives.

## Context to inspect
Checkpoint format, sharding, atomicity, retention, storage quotas, upload time, topology dependence, and restore code.

## Core knowledge
A model-weight snapshot alone is not a true training checkpoint. Exact or near-exact continuation may require optimizer, scheduler, scaler, RNG, data-loader/sampler, token counters, and configuration state.

## Procedure
1. Define required recovery fidelity and RPO.
2. Enumerate all state needed to continue training.
3. Choose sharded format compatible with target topology.
4. Write checkpoints atomically or through a committed manifest.
5. Add checksums and completeness metadata.
6. Benchmark save/load overhead.
7. Perform forced interruption and restore tests.
8. Compare resumed and uninterrupted trajectories.
9. Test retention and garbage collection.
10. Document migration rules across code/config versions.

## Decision points
Use frequent lightweight checkpoints when preemption risk is high; retain milestone checkpoints for evaluation and rollback. Permit topology-changing restore only after explicit compatibility tests.

## Common failure patterns
Missing sampler/RNG state; partially visible checkpoints; storage saturation; checkpoint written but never restore-tested; restoring with changed LR schedule.

## Verification
A controlled interruption resumes successfully, token position is correct, loss trajectory remains within expected stochastic variation, and checksum/manifest validation catches incomplete state.

## Expected output
A tested checkpoint policy, format, retention plan, and recovery runbook.

## Stop conditions
Stop training when no recent restorable checkpoint exists under required reliability policy or checkpoint corruption is detected.