# Scientific Data Pipelines

## Purpose
Build data pipelines that preserve scientific meaning, provenance, units, precision, and reproducibility from ingestion through analysis.

## When to use
Use when importing instrument/simulation data, transforming large datasets, standardizing formats, or diagnosing inconsistent scientific results.

## Inputs
Raw data sources, schemas, metadata, units, calibration information, transformation requirements, storage constraints, and consumers.

## Context to inspect
File formats, missing-value semantics, coordinate systems, timestamps, units, calibration versions, compression, partitioning, and lineage.

## Core knowledge
Scientific pipelines must preserve semantics, not only bytes. Unit conversions, coordinate transforms, calibration, filtering, resampling, and aggregation can alter conclusions if provenance is weak.

## Procedure
1. Define source contracts and scientific metadata.
2. Validate units, coordinate systems, and time bases.
3. Preserve raw immutable inputs where practical.
4. Make every transformation explicit and versioned.
5. Validate ranges, dimensional consistency, and missing data.
6. Track calibration and reference-data versions.
7. Choose formats and partitioning for access patterns.
8. Add checksums or integrity validation for critical artifacts.
9. Record lineage from derived outputs to source inputs.
10. Test the pipeline using known synthetic and real examples.

## Decision points
Prefer lossless transformations for canonical data; use lossy compression or downsampling only when its scientific impact is quantified and accepted.

## Common failure patterns
Silent unit conversion, ambiguous missing values, timezone errors, overwriting raw data, losing calibration metadata, and schema drift without versioning.

## Verification
Recompute selected outputs from raw inputs, validate invariants and units, compare against trusted references, and inspect lineage completeness.

## Expected output
A reproducible pipeline with validated schemas, provenance, transformation definitions, and integrity checks.

## Stop conditions
Escalate when source semantics, calibration state, or units cannot be determined reliably.