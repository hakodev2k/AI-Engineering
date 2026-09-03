# Fusion Architecture Design

## Purpose
Choose and design how multiple modalities are combined inside a multimodal model or application while controlling accuracy, latency, cost, and failure isolation.

## When to use
Use when comparing early fusion, late fusion, cross-attention, shared embedding spaces, routing, or ensemble-style architectures.

## Inputs
Task definition, modality encoders, representative data, latency budgets, compute limits, evaluation metrics.

## Preconditions
Know which modalities are always present, optional, asynchronous, or independently unreliable.

## Context to inspect
Inspect encoder capabilities, sequence lengths, temporal alignment, modality quality, accelerator memory, batching constraints, and serving topology.

## Core knowledge
Early fusion can learn rich interactions but increases coupling and compute. Late fusion improves modularity and missing-modality tolerance but may lose fine-grained interactions. Cross-attention can model detailed relationships but scales poorly with long sequences. Fusion choice should follow the task's interaction requirements.

## Procedure
1. Define cross-modal interactions required by the task.
2. Establish single-modality baselines.
3. Identify mandatory and optional modalities.
4. Estimate token/frame/feature volumes for each modality.
5. Compare candidate fusion points and information bottlenecks.
6. Model latency, memory, and throughput for each architecture.
7. Implement a minimal fusion baseline.
8. Add missing-modality handling explicitly.
9. Run ablations for every modality.
10. Evaluate robustness under corrupted inputs.
11. Compare accuracy gain against serving cost.
12. Document architecture rationale and fallback behavior.

## Decision points
Prefer early or cross-attention fusion for fine-grained interaction tasks. Prefer late fusion when modalities are loosely coupled, independently available, or served by separate systems.

## Common failure patterns
Complex fusion without single-modality baselines; assuming every modality helps; hidden dependence on modality order; unbounded sequence growth; no degraded-mode path.

## Verification
Run modality ablations, corrupted-input tests, latency benchmarks, and memory profiling. Verify gains persist across representative slices rather than only aggregate metrics.

## Expected output
A justified fusion architecture with baselines, ablations, resource estimates, and fallback design.

## Stop conditions
Stop when no candidate fusion strategy outperforms simpler baselines enough to justify added complexity or production constraints make the design infeasible.