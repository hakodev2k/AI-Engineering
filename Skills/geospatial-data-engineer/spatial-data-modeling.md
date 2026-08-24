# Spatial Data Modeling

## Purpose
Design reusable vector and raster data models that preserve spatial meaning, scale to production workloads, and support downstream analytics, APIs, and visualization.

## When to use
Use when introducing or restructuring spatial datasets, defining feature schemas, or deciding how geometry and attributes should be represented. Do not use to choose a coordinate system in isolation; use the CRS skill for that decision.

## Inputs
- Business and analytical requirements
- Sample spatial data
- Expected query patterns
- Data volume and update frequency
- Consumer constraints

## Context to inspect
Inspect existing schemas, geometry types, dimensionality, identifiers, temporal fields, lineage, and downstream contracts before changing the model.

## Core knowledge
A Senior engineer must understand geometry primitives, multipart geometries, nullability, temporal validity, normalization versus denormalization, raster versus vector representation, schema evolution, and interoperability constraints.

## Procedure
1. Identify the real-world entities and operations the model must support.
2. Determine whether each concept is best represented as vector, raster, tabular, or hybrid data.
3. Select geometry types and dimensionality deliberately.
4. Define stable identifiers and lineage fields.
5. Separate source-native attributes from curated domain attributes.
6. Define temporal semantics where geometry or attributes change over time.
7. Establish constraints for geometry validity and required attributes.
8. Design partitioning and storage boundaries for expected scale.
9. Validate compatibility with target databases, APIs, files, and map clients.
10. Document evolution rules and backward-compatibility expectations.

## Decision points
Prefer normalized authoritative models when integrity and reuse dominate. Prefer denormalized serving models when low-latency read paths justify duplication. Use raster when values are continuous over space; use vector when discrete features and topology matter.

## Common failure patterns
- Mixing incompatible geometry semantics in one field
- Unstable identifiers tied to source row order
- Losing temporal history during updates
- Overusing JSON for attributes that require queryability
- Encoding display concerns into authoritative data models

## Verification
Verify representative queries, spatial joins, serialization, geometry validity, schema constraints, and consumer compatibility using realistic data volumes.

## Expected output
A documented spatial schema with geometry choices, identifiers, constraints, temporal semantics, and compatibility notes.

## Stop conditions
Stop and escalate when entity semantics are ambiguous, source data cannot support required accuracy, or a schema change would break unmanaged external consumers.