# Coordinate Reference Systems

## Purpose
Select, transform, and validate coordinate reference systems so distance, area, alignment, storage, and interchange remain mathematically and operationally correct.

## When to use
Use for ingestion, reprojection, measurement, cross-dataset joins, map serving, or any workflow involving coordinates from multiple sources.

## Inputs
Source CRS metadata, target use case, geographic extent, accuracy requirements, transformation options, downstream format constraints.

## Preconditions
Do not proceed if source coordinates have no defensible CRS identification.

## Context to inspect
Inspect metadata, axis order, units, EPSG identifiers, datum, vertical reference, geographic extent, and existing transformation code.

## Core knowledge
CRS decisions affect measurement distortion, data alignment, axis interpretation, and transformation accuracy. Geographic coordinates are not interchangeable with projected coordinates, and datum transformations may require grids or region-specific operations.

## Procedure
1. Confirm the declared source CRS against coordinate ranges and source documentation.
2. Determine whether the workload needs storage, display, local measurement, global analysis, or interchange.
3. Select a target CRS appropriate to geographic extent and required metric properties.
4. Inspect available datum transformation operations and stated accuracy.
5. Handle axis order and units explicitly.
6. Transform representative samples before bulk processing.
7. Measure round-trip and control-point error where practical.
8. Preserve CRS metadata in all outputs.
9. Test downstream clients for CRS and axis compatibility.
10. Document why the chosen CRS is fit for purpose.

## Decision points
Use a projected CRS for metric distance or area when distortion is controlled for the region. Retain a geographic CRS for broad interoperability when precise planar measurement is not required. Prefer authoritative transformations over ad-hoc parameterization.

## Common failure patterns
- Treating latitude/longitude degrees as meters
- Swapping longitude and latitude
- Assuming EPSG codes imply identical axis behavior across libraries
- Ignoring vertical datum
- Applying a global projection to local high-accuracy work

## Verification
Verify known control points, units, bounds, transformation accuracy, and representative distance/area calculations.

## Expected output
A documented CRS and transformation strategy with validated metadata and accuracy evidence.

## Stop conditions
Stop when the source CRS is unknown, transformation accuracy is insufficient, or required datum resources are unavailable.