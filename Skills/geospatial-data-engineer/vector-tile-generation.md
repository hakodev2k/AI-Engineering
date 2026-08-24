# Vector Tile Generation

## Purpose
Build efficient vector-tile pipelines that preserve spatial meaning while meeting map rendering and bandwidth constraints.

## When to use
Use when serving large vector datasets to interactive maps or offline clients.

## Inputs
Source layers, zoom range, styling needs, geometry density, attribute needs, latency and size budgets.

## Context to inspect
Inspect source CRS, feature density, attributes, invalid geometries, simplification tolerance, tile scheme, and client capabilities.

## Core knowledge
Vector tiles trade geometric precision and attribute richness for compact, zoom-dependent delivery. Clipping, simplification, feature limits, and stable identifiers affect visual continuity and interactivity.

## Procedure
1. Define layer purpose and zoom ranges.
2. Select only attributes needed by clients.
3. Reproject to the tile scheme correctly.
4. Apply zoom-aware simplification and clipping.
5. Preserve stable IDs when interaction depends on feature identity.
6. Control dense regions using aggregation or feature limits.
7. Generate representative tiles at sparse and dense locations.
8. Measure tile size and generation latency.
9. Validate seams, labels, hit-testing, and attribute decoding.
10. Version the tile contract and generation configuration.

## Decision points
Prefer pre-generation for static, high-read workloads; generate dynamically when freshness dominates. Aggregate at low zooms rather than shipping excessive detail.

## Common failure patterns
Overloaded tiles, visible edge artifacts, unstable IDs, excess attributes, simplification that destroys topology, and one tolerance for all zooms.

## Verification
Check tile sizes, rendering continuity, feature identity, geometry correctness, and p95 serving latency.

## Expected output
A versioned tile-generation design and verified tiles across representative zooms.

## Stop conditions
Stop when client requirements are unclear, tile budgets cannot be met without unacceptable semantic loss, or source licensing forbids derived distribution.