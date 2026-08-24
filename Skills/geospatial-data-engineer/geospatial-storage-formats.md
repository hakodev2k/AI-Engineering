# Geospatial Storage Formats

## Purpose
Choose and configure geospatial storage formats that preserve semantics while meeting interoperability, scale, and access-pattern requirements.

## When to use
Use when selecting file formats, exchange contracts, archival representations, or analytics storage layouts.

## Inputs
Dataset type, volume, update pattern, consumer tools, cloud/object storage needs, compression and random-access requirements.

## Context to inspect
Inspect geometry/raster type, CRS metadata, schema complexity, partitioning, existing readers, and lifecycle requirements.

## Core knowledge
GeoPackage, GeoJSON, FlatGeobuf, GeoParquet, Shapefile, COG and related formats have different limits for schema, random access, cloud range reads, interoperability, and metadata fidelity.

## Procedure
1. Classify the workload as interchange, analytics, transactional, archival, or serving.
2. List mandatory semantics: CRS, types, nulls, precision, metadata, and large-file support.
3. Test candidate formats against actual consumer libraries.
4. Choose compression and row/tile grouping appropriate to reads.
5. Define partitioning and naming conventions.
6. Validate round-trip fidelity.
7. Benchmark representative reads and writes.
8. Document unsupported fields or lossy conversions.
9. Version the exchange contract.
10. Include migration guidance for future format changes.

## Decision points
Prefer columnar formats for large analytical scans; choose cloud-optimized raster formats for range access; favor simple interoperable formats for external exchange when scale permits.

## Common failure patterns
Using Shapefile despite field/type limits, unbounded GeoJSON at massive scale, missing CRS metadata, lossy type coercion, and partitioning by arbitrary file size instead of query pattern.

## Verification
Verify schema, CRS, precision, nulls, feature counts, read compatibility, and performance after round trip.

## Expected output
A storage-format decision with configuration, compatibility evidence, and known limitations.

## Stop conditions
Stop when required semantics cannot be represented or critical consumers cannot read the selected format.