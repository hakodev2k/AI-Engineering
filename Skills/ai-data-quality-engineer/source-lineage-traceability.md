# Source Lineage and Traceability

## Purpose
Establish end-to-end traceability from raw sources to derived AI datasets, features, labels, and evaluation artifacts.

## When to use
Use during incident investigation, source migration, audit preparation, dataset certification, or when derived values cannot be explained.

## Inputs
Pipeline definitions, source tables/files, transformation code, job metadata, dataset versions, feature definitions, model training manifests.

## Preconditions
Source and processing systems expose enough metadata to connect transformations.

## Context to inspect
Orchestration, storage layers, schema registry, feature store, labeling pipeline, dataset registry, model registry, and deployment metadata.

## Core knowledge
Lineage must capture both structural dependencies and versioned execution context. A graph that says dataset B came from A is insufficient if it cannot identify code version, parameters, source snapshot, and processing time.

## Procedure
1. Identify authoritative raw sources.
2. Map transformations to intermediate and final datasets.
3. Record code, configuration, and schema versions.
4. Capture dataset snapshot identifiers and timestamps.
5. Link label and feature generation jobs.
6. Link training and evaluation artifacts to exact data versions.
7. Validate lineage on representative records.
8. Mark external or opaque dependencies.
9. Add lineage checks to pipeline release processes.
10. Document ownership and retention expectations.

## Decision points
Automate lineage for recurring production paths; use manual evidence only for exceptional one-off datasets.

## Common failure patterns
Lineage without versioning, missing ad hoc transformations, losing source record IDs, and documenting only tables rather than execution context.

## Verification
A sampled model input or dataset row can be traced backward to its originating sources and forward to its consumers.

## Expected output
A versioned lineage map with owners, gaps, and traceability evidence.

## Stop conditions
Stop when critical transformations are opaque or source identifiers have been irreversibly discarded.