# Coordinate and Geometry Rules

## Purpose
Prevent silent geometric errors across image transforms, cameras, annotations, and outputs.

## Scope
Pixel coordinates, boxes, masks, keypoints, camera calibration, projection, resizing, cropping, padding, and coordinate frames.

## MUST
- Coordinate conventions MUST explicitly define origin, axis direction, units, indexing, box inclusivity, and normalized versus absolute representation.
- Geometric transforms MUST update labels and predictions consistently and be invertible where downstream mapping requires it.
- Camera calibration and extrinsics used for production decisions MUST be versioned and validated.
- Boundary and rounding behavior MUST be tested.

## MUST NOT
- Coordinate-frame assumptions MUST NOT cross component boundaries implicitly.
- Distorted and undistorted coordinates MUST NOT be mixed without explicit conversion.

## SHOULD
- Shared typed utilities SHOULD centralize high-risk geometric conversions.

## Exceptions
Approximate geometry requires documented error bounds and evidence that downstream tolerances are met.

## Verification
Use synthetic fixtures, known projections, round-trip tests, overlay visualization, calibration residuals, and boundary cases.