# Model Compression and Edge Inference

## Purpose
Reduce speech-model latency, memory, power, and storage requirements for edge or constrained deployment while preserving critical quality.

## When to use
Use when models must run on phones, embedded devices, browsers, edge gateways, or cost-sensitive infrastructure.

## Inputs
- Trained model
- Target hardware/runtime
- Accuracy guardrails
- Latency, memory, battery, and package-size budgets
- Representative evaluation corpus

## Context to inspect
Inspect operator support, tensor shapes, quantization compatibility, accelerator availability, memory bandwidth, model frontend cost, decoder cost, and runtime precision.

## Core knowledge
Compression options include quantization, pruning, distillation, lower-rank approximations, architectural simplification, caching, and runtime-specific graph optimization. The bottleneck may be memory bandwidth or frontend/decoder code rather than neural inference.

## Procedure
1. Benchmark the unmodified model on target hardware.
2. Profile CPU/GPU/NPU time, memory, and I/O separately.
3. Set explicit quality guardrails per important slice.
4. Try post-training quantization where supported.
5. Use quantization-aware training if post-training loss is unacceptable.
6. Evaluate pruning or distillation only after profiling confirms model size/compute is the bottleneck.
7. Optimize feature extraction and decoder paths as well as the network.
8. Validate streaming state and numerical stability after conversion.
9. Measure cold start, sustained latency, memory peak, energy, and package size.
10. Run full regression evaluation on the final runtime artifact, not the source framework model.

## Decision points
Prefer simpler compression when it meets budgets. Use int8 or mixed precision when hardware support is strong; use more aggressive techniques only when required. Distill when architectural downsizing is needed and retraining is feasible.

## Common failure patterns
- Benchmarking converted models only on desktop
- Ignoring unsupported operators and fallback execution
- Reporting average latency without tail or cold-start cost
- Validating framework outputs instead of deployed artifacts
- Compressing before identifying the real bottleneck

## Verification
Verify task metrics, subgroup regressions, p50/p95 latency, memory peak, energy/resource consumption, and exact target-runtime behavior.

## Expected output
A deployment artifact and benchmark report documenting compression method, quality trade-offs, hardware assumptions, and rollback criteria.

## Stop conditions
Stop if critical quality falls below guardrails, target runtime silently falls back to unsupported slow paths, or hardware constraints require a fundamentally different architecture.