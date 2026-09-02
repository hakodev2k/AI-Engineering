# Scientific I/O and Storage

## Purpose
Design efficient, portable, and integrity-preserving storage for large scientific datasets and simulation checkpoints.

## When to use
Use when datasets exceed memory, parallel I/O becomes a bottleneck, checkpoints are slow, or formats must support long-term reuse.

## Inputs
Dataset shapes, access patterns, metadata, precision, compression needs, concurrency, filesystem/object-store characteristics, and portability requirements.

## Context to inspect
HDF5/NetCDF/Zarr or equivalent formats, chunking, compression, collective I/O, metadata volume, checkpoint cadence, and restart behavior.

## Core knowledge
Scientific I/O performance depends on layout, chunking, access locality, metadata operations, parallel filesystem behavior, and compression trade-offs. Formats should preserve units, dimensions, coordinates, provenance, and schema evolution.

## Procedure
1. Characterize write and read access patterns.
2. Estimate dataset size and growth.
3. Define canonical metadata and units.
4. Choose format based on interoperability and execution environment.
5. Select chunking/partitioning aligned with dominant access.
6. Benchmark compression when I/O bandwidth is limiting.
7. Design parallel writes to avoid metadata and small-write contention.
8. Define checkpoint atomicity and restart compatibility.
9. Add integrity checks for critical artifacts.
10. Test forward/backward schema handling.

## Decision points
Use self-describing scientific formats for durable exchange; use simpler binary formats only when lifecycle and schema are tightly controlled. Compress when CPU cost is lower than avoided I/O cost.

## Common failure patterns
Tiny writes, pathological chunk sizes, missing units, non-atomic checkpoints, format lock-in without versioning, and benchmarking on local disks instead of production storage.

## Verification
Measure end-to-end read/write throughput at realistic scale, restart from checkpoints, and validate metadata and numerical round trips.

## Expected output
A storage design with format, layout, metadata contract, performance evidence, and recovery behavior.

## Stop conditions
Escalate when production storage characteristics or interoperability obligations are unknown.