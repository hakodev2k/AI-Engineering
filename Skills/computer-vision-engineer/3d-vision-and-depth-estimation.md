# 3D Vision and Depth Estimation

## Purpose
Engineer depth and 3D perception pipelines with correct geometry, calibration assumptions, uncertainty, and scale handling.

## When to use
Use for stereo, monocular depth, RGB-D, point-cloud, reconstruction, or spatial measurement tasks.

## Inputs
Camera models, calibration, synchronized frames, depth sensors, ground truth, accuracy/latency targets.

## Preconditions
Coordinate frames and units are defined.

## Context to inspect
Intrinsics, extrinsics, distortion, baseline, synchronization, missing depth, reflective/transparent surfaces, scale ambiguity.

## Core knowledge
3D quality depends on geometry and calibration as much as model quality. Monocular depth may provide relative rather than metric scale.

## Procedure
1. Validate calibration and coordinate conventions.
2. Establish geometric or sensor baseline.
3. Profile error by distance and scene condition.
4. Select model/sensor fusion strategy.
5. Handle invalid and low-confidence depth explicitly.
6. Propagate transforms and uncertainty.
7. Benchmark compute and memory.
8. Test drift, scale, occlusion, and edge cases.

## Decision points
Stereo vs monocular vs active depth; dense vs sparse; learned vs geometric reconstruction.

## Common failure patterns
Unit mismatch, stale calibration, unsynchronized frames, ignoring invalid depth, treating relative depth as metric.

## Verification
Measure depth error by range/slice, reprojection error, calibration residuals, and end-to-end spatial accuracy.

## Expected output
3D pipeline, calibration contract, error report, confidence policy, and known limits.

## Stop conditions
Stop when calibration or synchronization cannot be trusted enough to support target accuracy.