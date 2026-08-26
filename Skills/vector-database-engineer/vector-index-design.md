# Vector Index Design

## Purpose
Design vector indexes that meet retrieval-quality, latency, memory, and cost targets without assuming a specific database engine.

## When to use
Use when introducing semantic/vector search, changing ANN algorithms, or diagnosing recall/latency regressions. Do not tune an index before defining a representative evaluation set.

## Inputs
Embedding dimensions and metric, corpus size/growth, query distribution, recall target, latency SLO, memory/storage budget, update rate, filter requirements, and available infrastructure.

## Context to inspect
Inspect current schema, index type and parameters, embedding model/version, ingestion path, filters, query plans/profiles, production latency percentiles, recall evaluation, resource saturation, and operational constraints.

## Core knowledge
Exact search provides a quality baseline but scales poorly. ANN structures trade recall for speed and memory. HNSW favors strong recall/latency with memory-heavy graph structures; IVF-family indexes depend strongly on clustering and probe counts; disk-oriented ANN can reduce RAM pressure with I/O trade-offs. Distance metric must match embedding semantics. Index build parameters and query-time parameters solve different problems.

## Procedure
1. Define measurable recall, p95/p99 latency, throughput, freshness, and cost targets.
2. Build a representative labeled query set and exact-search baseline.
3. Confirm metric and vector normalization requirements.
4. Estimate corpus growth and memory/storage footprint.
5. Shortlist index families compatible with update and filtering patterns.
6. Benchmark candidate configurations on production-shaped data.
7. Sweep build and query parameters independently.
8. Measure recall, tail latency, throughput, memory, disk I/O, build duration, and update behavior.
9. Test filtered queries and skewed workloads separately.
10. Select the simplest configuration meeting targets with headroom.
11. Document assumptions and rollback path.

## Decision points
Prefer exact search for small corpora or strict correctness. Prefer graph ANN for high-recall low-latency workloads when memory is available. Prefer partitioned/disk-oriented designs when corpus size dominates RAM. Do not choose solely from vendor defaults.

## Common failure patterns
Wrong distance metric; benchmark data unlike production; optimizing average rather than tail latency; ignoring filter selectivity; excessive index parameters causing memory blowups; no exact baseline; rebuilding indexes unnecessarily; assuming higher ANN parameters always improve system-level performance.

## Verification
Re-run the fixed evaluation suite, compare against exact search, load-test at expected concurrency, inspect resource saturation, and validate results after restart/rebuild. Implementation is not verified until quality and SLO evidence both pass.

## Expected output
A justified index configuration, benchmark evidence, capacity estimate, operational notes, and rollback plan.

## Stop conditions
Stop if embedding semantics are unknown, evaluation data is unrepresentative, destructive rebuild requires approval, or production capacity cannot safely support the test.