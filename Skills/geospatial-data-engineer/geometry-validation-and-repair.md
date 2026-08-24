# Geometry Validation and Repair

## Purpose
Detect invalid, malformed, or semantically suspicious geometries and repair them only when the repair preserves intended spatial meaning.

## When to use
Use during ingestion, migration, spatial analysis failures, topology cleanup, or before publishing authoritative geometry.

## Inputs
Geometry dataset, CRS, source semantics, validity rules, accepted repair policy, downstream requirements.

## Context to inspect
Inspect geometry types, dimensionality, self-intersections, ring orientation, empties, duplicates, extreme coordinates, precision, and prior repair history.

## Core knowledge
Geometric validity is library- and model-dependent, and a technically valid repair may still be semantically wrong. Repair operations can split polygons, remove components, alter boundaries, or change area.

## Procedure
1. Profile invalidity by type and frequency.
2. Separate syntactic invalidity from domain-semantic anomalies.
3. Capture representative failing examples.
4. Apply the least destructive supported validation or normalization.
5. Compare pre/post component count, area, length, and bounds.
6. Quarantine records whose repair changes meaning beyond tolerance.
7. Preserve original geometry or lineage to it.
8. Re-run topology and business rules after repair.
9. Record repair method and software version.
10. Add regression tests for discovered failure classes.

## Decision points
Auto-repair only repeatable, understood failure modes. Prefer rejection or manual review when ambiguity affects legal, cadastral, safety, or high-value boundaries.

## Common failure patterns
Blind make-valid operations, dropping small parts without thresholds, treating empty as null, precision reduction that breaks topology, and deleting invalid features to make pipelines green.

## Verification
Verify validity, feature counts, area/length deltas, topology rules, and downstream query behavior against accepted tolerances.

## Expected output
Validated geometry plus an auditable repair/rejection record.

## Stop conditions
Stop when repair semantics are ambiguous, acceptable distortion is undefined, or authoritative geometry requires domain approval.