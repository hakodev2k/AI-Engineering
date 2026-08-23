# Localization and Mapping

## Purpose
Build and validate localization and mapping behavior that remains accurate, bounded, and recoverable across realistic environments.

## When to use
Use when implementing SLAM, map-based localization, relocalization, map maintenance, or diagnosing pose drift.

## Inputs
Sensor suite, environment characteristics, map representation, motion model, frame conventions, compute budget, accuracy targets.

## Preconditions
Sensor calibration, timestamps, and transforms are validated.

## Context to inspect
Map lifecycle, loop closure, feature density, scan matching, GNSS availability, relocalization behavior, covariance, CPU/GPU load, storage.

## Core knowledge
Localization quality depends on observability, map quality, motion excitation, dynamic-scene handling, and sensor failure modes. Global consistency and locally smooth control pose may require separate frames.

## Procedure
1. Define required absolute and relative accuracy.
2. Characterize environment texture/geometry and dynamic content.
3. Choose localization/map representation based on sensors and mission.
4. Validate odometric input and motion constraints.
5. Configure data association and outlier rejection.
6. Establish loop-closure/relocalization criteria.
7. Test initialization from valid and invalid starting poses.
8. Measure drift over representative trajectories.
9. Test degraded sensing and map mismatch.
10. Define map update, versioning, and rollback process.

## Decision points
Use offline maps when stability and repeatability dominate; use online SLAM when environments or deployment workflows require map creation. Avoid loop closure if false positives are more dangerous than bounded drift.

## Common failure patterns
Map-frame jumps reaching controllers, false loop closures, stale maps, localization overconfidence, poor initialization, and testing only in feature-rich environments.

## Verification
Measure trajectory error, relocalization success, drift, map consistency, CPU/memory use, and failure recovery against representative datasets or ground truth.

## Expected output
Validated localization/mapping configuration, accuracy evidence, map lifecycle rules, and known operational limits.

## Stop conditions
Stop when environment observability is insufficient, pose jumps violate control safety, or required accuracy cannot be demonstrated.