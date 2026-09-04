# Vision Data Pipeline Engineering

## Purpose
Engineer reproducible, scalable pipelines that ingest, validate, transform, version, and deliver image/video data for training and evaluation.

## When to use
Use when dataset preparation is slow, unreproducible, memory-heavy, failure-prone, or inconsistent across training jobs.

## Inputs
Source stores, metadata/schema, preprocessing rules, dataset version policy, target framework, infrastructure limits, and data-governance requirements.

## Context to inspect
Storage format, file counts and sizes, codecs, network locality, shard strategy, caching, parallel readers, corruption handling, metadata joins, and lineage.

## Core knowledge
Vision workloads can be I/O-bound long before GPU compute saturates. Efficient formats, deterministic manifests, sharding, prefetching, cache locality, bounded decoding concurrency, and lineage are critical for reliable experimentation.

## Procedure
1. Trace raw data from source to model batch.
2. Define immutable source identifiers and manifests.
3. Validate schema, media readability, dimensions, and checksums.
4. Separate deterministic preprocessing from stochastic augmentation.
5. Select storage/sharding formats suited to access patterns.
6. Parallelize decoding without exhausting CPU, memory, or file descriptors.
7. Add bounded prefetch and caching where measured bottlenecks justify them.
8. Persist dataset and transformation versions with experiments.
9. Make failed/corrupt samples explicit rather than silently dropping them.
10. Benchmark examples/sec and accelerator utilization.
11. Add restartability and idempotent materialization.
12. Test a clean rebuild from source manifests.

## Decision points
Precompute expensive deterministic transforms when storage cost is lower than repeated compute; transform online when flexibility matters. Use large shards for sequential cloud reads and smaller units when random access or partial rebuilds dominate.

## Common failure patterns
Silent sample loss, unversioned manifests, random seeds tied to worker order, tiny-file storms, duplicated preprocessing, oversized caches, and GPU starvation hidden as model slowness.

## Verification
Verify deterministic dataset identity, clean rebuildability, corruption accounting, throughput under realistic concurrency, and parity between local and production training environments.

## Expected output
A versioned data pipeline with manifests, validation checks, throughput measurements, lineage, and recovery behavior.

## Stop conditions
Stop if source lineage cannot be established, sensitive data handling is unresolved, or optimization would require destructive conversion without a recoverable source copy.