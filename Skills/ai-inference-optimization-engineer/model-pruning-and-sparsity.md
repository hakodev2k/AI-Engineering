# Model Pruning and Sparsity

## Purpose
Reduce inference compute and memory by removing low-value parameters or exploiting structured sparsity while preserving acceptable model quality.

## When to use
Use when the deployment runtime and hardware can exploit sparse representations and dense-model cost is materially limiting.

## Inputs
Reference model, evaluation data, hardware sparsity support, runtime/kernel support, retraining budget, quality thresholds, and performance baseline.

## Context to inspect
Inspect layer sensitivity, structured-sparsity constraints, sparse-kernel availability, memory format, retraining options, and whether sparsity produces real end-to-end acceleration.

## Core knowledge
Unstructured sparsity often compresses storage without speeding commodity accelerator inference. Structured sparsity is easier for hardware to exploit but may cause greater quality loss. Pruning usually requires task-aware validation and sometimes recovery fine-tuning.

## Procedure
1. Define the performance target and acceptable quality loss.
2. Confirm the target hardware/runtime accelerates the candidate sparsity pattern.
3. Profile layers to identify compute-heavy candidates.
4. Measure parameter sensitivity using representative data.
5. Apply conservative structured pruning first.
6. Fine-tune or recover weights when justified.
7. Export into the runtime-supported sparse format.
8. Benchmark actual kernels, latency, throughput, and memory.
9. Evaluate quality across critical workload slices.
10. Increase sparsity only while measured value remains positive.

## Decision points
Prefer structured patterns when hardware requires them. Avoid pruning if dense quantization gives larger benefits with lower quality risk. Use recovery training when quality loss is concentrated and economically justified.

## Common failure patterns
Reporting parameter sparsity as performance improvement, using unsupported sparse kernels, pruning uniformly across sensitive layers, and validating only aggregate quality.

## Verification
Confirm sparse kernels execute in profiler traces, benchmark end-to-end improvements against dense baseline, and verify quality thresholds across important task slices.

## Expected output
A deployable sparse model and evidence showing real hardware-level benefit.

## Stop conditions
Stop when sparsity is not accelerated by the target stack, quality loss exceeds limits, or retraining requirements exceed the deployment budget.