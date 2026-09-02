# Model Selection and Sizing

## Purpose
Select models that meet edge-device accuracy, latency, memory, storage, energy, and maintainability constraints instead of optimizing only offline quality metrics.

## When to use
Use when choosing an initial model, replacing an oversized model, introducing a new hardware tier, or investigating why a model that performs well in the lab is impractical on-device.

## Inputs
Candidate models, target hardware, runtime support, representative datasets, latency SLOs, memory limits, power budget, package-size limits, and quality thresholds.

## Preconditions
Representative hardware and evaluation data must be available, or uncertainty must be explicitly recorded.

## Context to inspect
Operator support, tensor shapes, precision modes, runtime versions, accelerator compatibility, model initialization cost, peak memory, and preprocessing assumptions.

## Core knowledge
Parameter count alone does not predict deployability. Operator mix, activation memory, tensor layout, dynamic shapes, quantization behavior, accelerator utilization, and preprocessing cost can dominate. A smaller model can be slower if it maps poorly to the target runtime.

## Procedure
1. Define minimum acceptable quality and hard device constraints.
2. Establish a small set of model families rather than prematurely committing to one.
3. Export each candidate through the actual target toolchain.
4. Verify all operators and shapes are supported without hidden fallback.
5. Measure cold start, steady-state latency, peak memory, storage size, and energy where relevant.
6. Evaluate quality on representative and difficult subsets.
7. Compare performance under expected concurrency and thermal state.
8. Record hardware/runtime-specific regressions.
9. Prefer the simplest model with sufficient headroom rather than the absolute largest deployable model.
10. Define a re-evaluation trigger for future hardware or runtime changes.

## Decision points
Choose a larger model only when measurable quality gains justify resource cost and reduced headroom. Prefer architectures with mature accelerator support when operational predictability matters more than theoretical novelty.

## Common failure patterns
Benchmarking only on desktop GPUs, ignoring cold start, using synthetic inputs that hide preprocessing cost, relying on parameter count as a proxy for memory, and accepting CPU fallback without measuring it.

## Verification
Benchmark exported artifacts on every supported hardware tier and confirm quality, latency percentiles, peak memory, package size, and sustained behavior remain inside limits.

## Expected output
A justified model choice with measured trade-offs, rejected alternatives, and hardware-specific evidence.

## Stop conditions
Stop when the target runtime cannot faithfully execute the candidate model or when no candidate satisfies mandatory quality and device constraints.