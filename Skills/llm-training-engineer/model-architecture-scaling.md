# Model Architecture and Scaling

## Purpose
Choose model dimensions and architectural features that fit capability goals, hardware constraints, and training budget.

## When to use
Use before new model-family training or material architecture changes.

## Inputs
Compute budget, target tokens, context length, accelerator topology, memory limits, throughput targets, architecture baselines, scaling experiments.

## Context to inspect
Parameter allocation, attention design, positional encoding, normalization, activation, vocabulary, parallelism compatibility, kernel support, and serving constraints.

## Core knowledge
Parameter count alone does not determine quality. Depth/width, token budget, data quality, optimizer, context, and hardware utilization interact. Architectural novelty adds implementation and optimization risk and should earn its complexity through evidence.

## Procedure
1. Establish a proven baseline architecture.
2. Calculate parameter and activation memory.
3. Estimate FLOPs and target training tokens.
4. Check divisibility and tensor shapes against accelerator topology.
5. Validate attention/context memory at target sequence lengths.
6. Run small-scale architecture ablations.
7. Compare quality per unit compute and throughput.
8. Test numerical stability and kernel coverage.
9. Evaluate inference implications before locking design.
10. Freeze a machine-readable architecture specification.

## Decision points
Favor standard components when gains from novelty are uncertain. Adjust depth/width based on measured efficiency, not aesthetics. Choose dense versus sparse architectures only after considering routing, communication, training stability, and serving complexity.

## Common failure patterns
Scaling parameter count without token budget; architecture incompatible with efficient kernels; ignoring KV-cache cost; extrapolating from one small-scale run; untracked config drift.

## Verification
Parameter counts, memory estimates, FLOP estimates, topology mapping, and small-scale training results agree with implementation measurements.

## Expected output
A frozen architecture configuration with scaling rationale, resource estimates, ablation evidence, and deployment implications.

## Stop conditions
Stop when the design exceeds resource envelopes, lacks stable kernels, or shows unresolved numerical instability.