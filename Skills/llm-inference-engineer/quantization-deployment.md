# Quantization Deployment

## Purpose
Reduce model memory and compute cost while controlling quality and runtime compatibility risk.

## When to use
Use when serving cost, memory footprint, or throughput requires lower precision.

## Inputs
Baseline model, representative evaluation set, target hardware/runtime, SLOs, quality thresholds, and candidate quantization formats.

## Context to inspect
Supported kernels, calibration requirements, sensitive layers, tokenizer/model revisions, conversion tooling, and fallback artifacts.

## Core knowledge
Quantization is a system trade-off: nominal bit width does not guarantee faster inference. Kernel support, dequantization overhead, group size, activation precision, and model sensitivity determine real benefit.

## Procedure
1. Establish unquantized quality and performance baselines.
2. Select formats actually optimized on target hardware.
3. Convert from a pinned model revision with reproducible tooling.
4. Run task-specific and adversarial quality evaluations.
5. Benchmark TTFT, inter-token latency, throughput, memory, and power/cost.
6. Inspect regressions by task and sequence length rather than aggregate score only.
7. Validate distributed and long-context behavior.
8. Package quantized artifacts with metadata and checksum.
9. Canary against the baseline and retain rollback capability.

## Decision points
Choose the lowest precision that meets quality and operational targets, not the smallest artifact. Prefer weight-only approaches when activation quantization degrades quality or lacks kernel support.

## Common failure patterns
Trusting generic benchmark scores, using unsupported formats, converting from ambiguous revisions, and deploying without task-specific evaluation.

## Verification
Require reproducible conversion, quality gates, performance gains on production hardware, and successful rollback rehearsal.

## Expected output
Versioned artifact, evaluation evidence, performance comparison, and deployment decision.

## Stop conditions
Stop when quality loss exceeds agreed thresholds or runtime kernels make the format slower/unstable.