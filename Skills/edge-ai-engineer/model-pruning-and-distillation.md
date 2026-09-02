# Model Pruning and Distillation

## Purpose
Reduce model complexity or transfer capability into a smaller edge-suitable student model while maintaining task quality and deployability.

## When to use
Use when quantization alone is insufficient, a teacher model provides substantially better quality than deployable candidates, or structured sparsity is supported by the target stack.

## Inputs
Teacher/baseline model, student architecture candidates, training data, target hardware, runtime support, quality thresholds, and resource budgets.

## Preconditions
Establish a production-relevant baseline and confirm whether target hardware can exploit the intended sparsity pattern.

## Context to inspect
Training pipeline, logits/features available for distillation, layer sensitivity, structured vs unstructured sparsity support, export graph, and accelerator kernels.

## Core knowledge
Unstructured pruning often reduces parameter count without reducing wall-clock latency on edge hardware. Structured pruning changes tensor dimensions and is more likely to produce practical gains. Distillation is a training strategy, not a guarantee of deployability; the student architecture must still map well to the target runtime.

## Procedure
1. Identify the exact constraint that requires additional compression.
2. Profile the baseline to locate expensive layers and operators.
3. Check target support for structured sparsity before choosing pruning.
4. Select a student architecture with proven runtime compatibility.
5. Define teacher targets: logits, intermediate features, labels, or combinations.
6. Establish a training/evaluation protocol with difficult-case subsets.
7. Increase sparsity or reduce student capacity incrementally.
8. Re-export and benchmark after meaningful architecture changes.
9. Compare quality, latency, peak memory, energy, and package size.
10. Retain only compression that creates measurable device-level benefit.
11. Document retraining requirements and reproducibility inputs.

## Decision points
Prefer distillation when a compact architecture already runs efficiently; prefer structured pruning when a deployed architecture has removable width/depth and retraining cost is acceptable. Avoid unstructured sparsity without hardware/runtime acceleration.

## Common failure patterns
Celebrating FLOP reduction without wall-clock gain, pruning unsupported patterns, distilling from biased teacher outputs, and measuring only aggregate accuracy.

## Verification
Benchmark the final exported artifact on each target tier and compare against the uncompressed baseline with identical inputs and sustained runs.

## Expected output
A smaller deployable model with evidence that compression improved real device constraints without unacceptable quality loss.

## Stop conditions
Stop when compression produces no practical device gain, retraining data is insufficient, or quality regressions exceed approved thresholds.