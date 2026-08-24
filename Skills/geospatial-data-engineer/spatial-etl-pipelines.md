# Spatial ETL Pipelines

## Purpose
Build reliable ingestion and transformation pipelines for geospatial data while preserving geometry, CRS, lineage, and quality guarantees.

## When to use
Use when importing files, APIs, database extracts, telemetry, or remote-sensing products into curated spatial datasets.

## Inputs
Source contracts, schemas, CRS metadata, target schema, volumes, update cadence, quality requirements, lineage requirements.

## Context to inspect
Inspect source stability, encoding, geometry validity, dimensionality, identifiers, duplicates, coordinate systems, and downstream consumers.

## Core knowledge
Spatial ETL must validate both tabular and spatial semantics. Reprojection, topology repair, simplification, clipping, and type coercion can silently change meaning and must be explicit.

## Procedure
1. Profile representative source samples.
2. Define an immutable raw landing representation where feasible.
3. Validate schema, encoding, CRS, bounds, and geometry types.
4. Normalize identifiers and timestamps.
5. Apply transformations in auditable stages.
6. Record rejected records with reasons.
7. Preserve source lineage and processing version.
8. Make writes idempotent for reruns.
9. Validate counts, spatial extent, null rates, and geometry quality after each major stage.
10. Publish only after downstream contract checks pass.

## Decision points
Repair malformed geometries only when repair semantics are acceptable; otherwise quarantine. Reproject during curation when consumers need one canonical CRS; preserve source CRS in raw storage for traceability.

## Common failure patterns
Silent geometry repair, duplicate ingestion, unbounded memory processing, loss of CRS metadata, non-idempotent upserts, and overwriting raw source data.

## Verification
Compare record counts, spatial extents, checksums where possible, rejected-record rates, geometry validity, and rerun behavior.

## Expected output
A reproducible, observable ETL workflow with lineage, rejection handling, and verified spatial quality.

## Stop conditions
Stop when source semantics are unclear, transformation loss exceeds accepted thresholds, or destructive updates lack rollback.