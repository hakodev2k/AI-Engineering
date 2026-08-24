# Raster Processing and Tiling

## Purpose
Design scalable raster processing workflows for reprojection, resampling, mosaicking, pyramids, and tiled delivery without corrupting pixel meaning.

## When to use
Use for imagery, elevation, climate grids, classified rasters, or any large gridded spatial dataset.

## Inputs
Raster metadata, CRS, resolution, bands, nodata semantics, resampling requirements, target storage and serving patterns.

## Context to inspect
Inspect pixel size, geotransform, nodata values, band types, compression, overviews, alignment, extent, and target access pattern.

## Core knowledge
Resampling changes values differently for continuous versus categorical data. Tiling, chunking, compression, and pyramids determine I/O efficiency. Pixel alignment matters for comparisons and map algebra.

## Procedure
1. Classify each band as continuous, categorical, mask, or derived.
2. Validate CRS, geotransform, resolution, and nodata semantics.
3. Choose target grid and alignment.
4. Select resampling appropriate to data semantics.
5. Process in bounded windows or chunks rather than loading whole rasters.
6. Build overviews or pyramids for multi-resolution access.
7. Choose compression and tile size based on read/write patterns.
8. Preserve metadata and provenance.
9. Validate seam behavior when mosaicking.
10. Benchmark representative reads and transformations.

## Decision points
Use nearest-neighbor for categorical values unless domain rules say otherwise. Prefer cloud-optimized/tiled layouts for range-read workflows. Regrid only when interoperability or analytics justify the transformation cost.

## Common failure patterns
Bilinear resampling of class codes, nodata treated as zero, misaligned grids, unnecessary full rewrites, oversized tiles, and loss of metadata.

## Verification
Verify sample values, bounds, resolution, nodata masks, seam continuity, file size, and access latency.

## Expected output
A tiled or transformed raster product with documented grid, resampling, metadata, and performance characteristics.

## Stop conditions
Stop when band semantics are unknown, target resolution would destroy required detail, or reprojection error exceeds accepted limits.