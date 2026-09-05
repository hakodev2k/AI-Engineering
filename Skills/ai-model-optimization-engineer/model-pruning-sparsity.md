# Model Pruning and Sparsity

## Purpose
Remove low-value parameters or structure to reduce compute and memory while preserving required model quality.

## When to use
For overparameterized models or hardware/runtime stacks with useful sparse execution support.

## Inputs
Model, evaluation data, training capability, target hardware, runtime, baseline metrics.

## Preconditions
Confirm sparse formats and kernels are actually supported by the deployment path.

## Context to inspect
Inspect layer sensitivity, parameter distributions, structured dimensions, retraining budget, export constraints, and accelerator sparsity requirements.

## Core knowledge
Unstructured sparsity often reduces parameter count without wall-clock gains. Structured pruning is easier to accelerate but can damage capacity more quickly. Recovery fine-tuning may be essential.

## Procedure
1. Define quality and performance targets.
2. Verify executable sparsity patterns on target hardware.
3. Rank candidate layers/structures by sensitivity.
4. Apply conservative pruning increments.
5. Fine-tune or recover when justified.
6. Evaluate critical quality slices after each increment.
7. Export to the target sparse representation.
8. Benchmark end-to-end latency, throughput, memory, and cost.
9. Compare against dense alternatives of similar quality.
10. Retain the simplest artifact meeting objectives.

## Decision points
Use structured pruning when deployment speed matters and sparse kernels are limited; use unstructured methods primarily when storage/compression or supported sparse hardware makes them valuable.

## Common failure patterns
Claiming speedup from parameter count alone, pruning uniformly across sensitive layers, evaluating before export only, and ignoring retraining cost.

## Verification
The deployed sparse artifact meets quality gates and demonstrates measured resource or performance gains on target hardware.

## Expected output
Pruned artifact, sparsity pattern, recovery procedure, benchmarks, and quality-impact report.

## Stop conditions
Stop if runtime support is absent, quality degradation exceeds limits, or recovery cost outweighs deployment benefit.