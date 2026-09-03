# Training Pipeline Design

## Purpose
Design research training pipelines that are correct, measurable, reproducible, and flexible enough to test hypotheses without turning every experiment into bespoke infrastructure work.

## When to use
Use when creating or substantially modifying model training code, introducing a new architecture or objective, changing data flow, or preparing experiments that will scale beyond a single prototype run.

## Inputs
- Model and objective definition
- Dataset pipeline
- Optimizer and scheduler requirements
- Hardware and memory constraints
- Precision strategy
- Experiment tracking and checkpoint requirements

## Preconditions
A minimal reference implementation or mathematical specification should exist. Clarify which parts of the pipeline are experimental variables and which must remain stable across runs.

## Context to inspect
Inspect data loading, shuffling, batching, token/sample accounting, loss normalization, optimizer state, gradient accumulation, precision casting, distributed primitives, checkpoint format, resume behavior, logging, validation cadence, and failure recovery.

## Core knowledge
Training correctness depends on invariants such as effective batch size, loss scaling, gradient synchronization, token counting, masking, optimizer-step semantics, and checkpoint completeness. Performance optimizations must not silently alter the research intervention. Research pipelines benefit from explicit configuration and modular boundaries, but excessive abstraction can make mechanisms difficult to inspect.

## Procedure
1. Define the training step mathematically before optimizing implementation.
2. Establish invariants for shapes, masks, losses, token/sample counts, and effective batch size.
3. Build a tiny-data overfit test to validate that the model can learn.
4. Validate forward and backward passes in full precision or a numerically stable reference mode.
5. Add mixed precision only after correctness checks pass.
6. Separate model, data, objective, optimization, evaluation, and logging configuration.
7. Make every research-relevant hyperparameter explicit and serializable.
8. Implement checkpointing for model, optimizer, scheduler, scaler, RNG state, and progress counters as needed.
9. Test resume equivalence across a short controlled run.
10. Instrument loss components, gradient norms, learning rate, throughput, memory, and data progress.
11. Add validation at a cadence that supports diagnosis without excessive overhead.
12. Add assertions for NaNs, invalid labels, impossible shapes, and corrupted batches.
13. Profile the pipeline to distinguish model compute, communication, and input bottlenecks.
14. Confirm that optimized and reference paths agree within numerical tolerance.
15. Freeze a validated pipeline version for confirmatory experiments.

## Decision points
- Prefer explicit code over abstraction when the abstraction hides a research-critical mechanism.
- Use gradient accumulation when memory requires it, but verify optimizer and scheduler semantics use the intended effective batch.
- Use mixed precision when stable and beneficial; retain a higher-precision diagnostic path.
- Optimize input pipelines only after measuring whether they limit accelerator utilization.

## Common failure patterns
- Incorrect loss normalization across variable-length batches.
- Scheduler steps tied to microbatches instead of optimizer steps.
- Missing optimizer or RNG state in checkpoints.
- Silent data repetition or omission in distributed samplers.
- Mixed-precision overflow interpreted as model instability.
- Performance refactors that change the effective objective.
- Logging only aggregate loss and losing diagnostic signal.

## Verification
Implementation is complete when training, validation, checkpointing, and resume paths execute. Verification requires tiny-data overfit success, reference-versus-optimized numerical checks, checkpoint-resume equivalence, invariant tests, stable metrics, and evidence that throughput measurements represent the intended training computation.

## Expected output
A scriptable training pipeline with explicit configuration, correctness tests, checkpoints, observability, reproducibility metadata, and documented performance characteristics.

## Stop conditions
Stop when the mathematical objective is ambiguous, numerical divergence cannot be localized, data invariants are violated, resume behavior changes results beyond expected tolerance, or infrastructure behavior prevents a fair experiment.