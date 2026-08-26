# Quantization and Compression

## Purpose
Reduce vector memory/storage and improve throughput while controlling retrieval-quality loss.

## When to use
Use when vectors/indexes exceed economical memory/storage or bandwidth becomes limiting.

## Inputs
Vector distribution, dimensions, corpus size, quality targets, hardware, index options, and evaluation suite.

## Context to inspect
Inspect current precision, raw/index footprint, cache residency, I/O, ANN algorithm, reranking, and exact baseline.

## Core knowledge
Scalar/product/binary quantization trade representation fidelity for footprint and speed. Compression can increase candidate-generation error; rescoring with original/full-precision vectors can recover quality at additional cost. Benefits depend on hardware and workload.

## Procedure
1. Measure baseline recall/relevance, latency, throughput, memory, and storage.
2. Identify the actual constrained resource.
3. Shortlist supported quantization modes and training requirements.
4. Train/calibrate on representative vectors where required.
5. Benchmark multiple compression levels.
6. Evaluate quality by query segment, not only aggregate.
7. Test candidate expansion plus full-precision rescoring if available.
8. Measure build time, update behavior, CPU/GPU utilization, and disk/network changes.
9. Select the least lossy configuration that resolves the capacity/performance constraint.
10. Preserve rollback to full precision.

## Decision points
Use aggressive quantization when modest recall loss is acceptable or rescoring recovers it; retain higher precision for quality-critical workloads. Do not compress merely because the feature exists.

## Common failure patterns
No quality baseline; calibration data unlike production; comparing only storage size; forgetting full-precision rescoring cost; changing ANN and quantization simultaneously; assuming compression always lowers latency.

## Verification
Run held-out retrieval evaluation and production-shaped load; verify footprint savings, SLOs, and quality threshold together.

## Expected output
A measured compression configuration, quality/cost trade-off, capacity impact, and rollback plan.

## Stop conditions
Stop if quality judgments are unavailable or compression requires an unapproved irreversible rebuild.