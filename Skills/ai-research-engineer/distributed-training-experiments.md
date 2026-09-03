# Distributed Training Experiments

## Purpose
Run and diagnose distributed AI training experiments without allowing parallelization details to invalidate research conclusions. This skill focuses on correctness, scaling behavior, communication cost, reproducibility, and failure recovery across multiple accelerators or nodes.

## When to use
Use when a model, batch, context length, or dataset requires multi-device training; when comparing data/model parallel strategies; or when scaling a validated single-device experiment.

## Inputs
- Validated single-device or small-scale training configuration
- Model and optimizer requirements
- Target hardware topology
- Parallelism strategy
- Communication/runtime configuration
- Checkpoint and experiment tracking setup

## Preconditions
Demonstrate correctness at the smallest practical scale first. Know the intended global batch size, token budget, optimizer semantics, and numerical precision.

## Context to inspect
Inspect device topology, interconnects, collective libraries, process launch configuration, world size, rank mapping, distributed sampler behavior, gradient synchronization, sharding, pipeline stages, tensor-parallel groups, checkpoint format, timeout policy, and cluster preemption behavior.

## Core knowledge
Distributed training can alter numerics, optimizer behavior, data order, and failure probability. Scaling efficiency is not proof of training equivalence. A Senior researcher validates both systems metrics and learning behavior, and treats effective batch-size changes as a research variable rather than an implementation detail.

## Procedure
1. Record the validated small-scale reference metrics.
2. Define global batch size, microbatch size, accumulation, and world size explicitly.
3. Select the simplest parallelism strategy that fits memory and throughput goals.
4. Validate sample/token partitioning with no unintended duplication or omission.
5. Compare a short distributed run against the reference for loss and update equivalence within expected numerical tolerance.
6. Instrument compute time, communication time, input time, utilization, memory, and stragglers.
7. Measure scaling efficiency while increasing device count under controlled conditions.
8. Check collective synchronization and gradient norms across ranks.
9. Validate mixed-precision and loss-scaling behavior at full scale.
10. Exercise checkpoint save and restore across the distributed topology.
11. Test recovery from a representative interruption or preemption.
12. Record topology and software stack in experiment metadata.
13. Investigate performance regressions before changing algorithmic settings.
14. Reconfirm learning curves after any parallelism or communication optimization.

## Decision points
- Prefer data parallelism when the model fits per device and batch scaling remains scientifically acceptable.
- Use sharded or model parallel approaches when memory, not data throughput, is the primary limit.
- Reduce communication frequency only when its effect on optimization is explicitly part of the experiment.
- Prefer stable throughput over fragile peak performance for long expensive runs.

## Common failure patterns
- Accidentally increasing the global batch without retuning or acknowledging it.
- Duplicate samples from incorrect distributed sampling.
- Comparing throughput while changing sequence length or precision.
- Rank-specific data corruption hidden by aggregate logging.
- Checkpoints that cannot be restored under a changed world size.
- Treating communication-induced hangs as model failures.
- Ignoring slow nodes that distort wall-clock comparisons.

## Verification
Implementation is complete when the distributed run trains and checkpoints. Verification requires learning behavior consistent with the reference, validated global-batch semantics, correct data partitioning, successful restore, and systems measurements that explain scaling efficiency and bottlenecks.

## Expected output
A validated distributed training configuration, equivalence evidence, scaling measurements, topology metadata, checkpoint/recovery evidence, and documented operational limits.

## Stop conditions
Stop when distributed and reference learning behavior diverge without explanation, data partitioning is incorrect, checkpoint integrity is uncertain, repeated infrastructure failures make results incomparable, or scaling changes the research question unintentionally.