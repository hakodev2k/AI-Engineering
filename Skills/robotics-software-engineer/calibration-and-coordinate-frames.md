# Calibration and Coordinate Frames

## Purpose
Establish trustworthy intrinsic, extrinsic, joint, and tool calibration and maintain a coherent transform tree across the robot.

## When to use
Use when integrating sensors, changing hardware mounts, diagnosing spatial drift, or commissioning a robot.

## Inputs
- Sensor/robot models
- Calibration target or reference measurements
- Transform conventions
- Recorded datasets
- Accuracy requirements

## Preconditions
The physical mounting must be stable enough for the required accuracy and the calibration reference must be measurable.

## Context to inspect
Inspect TF trees, frame naming, static transforms, calibration files, firmware offsets, camera intrinsics, joint zero offsets, and tool-center-point definitions.

## Core knowledge
Understand SE(3) transforms, quaternion conventions, handedness, intrinsic/extrinsic calibration, observability, residuals, covariance, overfitting, and calibration drift.

## Procedure
1. Define frame ownership and naming conventions.
2. Capture data spanning the necessary observability conditions.
3. Verify timestamps before solving spatial calibration.
4. Estimate parameters with a suitable calibration method.
5. Inspect residuals and outliers rather than accepting solver success alone.
6. Validate results on held-out poses or measurements.
7. Store calibration with hardware identity and version metadata.
8. Ensure only one authoritative source publishes each static transform.
9. Add plausibility checks at startup.
10. Define recalibration triggers after hardware changes or drift.

## Decision points
Prefer factory calibration when traceable and sufficient; recalibrate when mounting or accuracy requirements invalidate it. Use online calibration only when observability and safety implications are understood.

## Common failure patterns
- Duplicate transform publishers
- Wrong quaternion ordering
- Calibration performed with insufficient motion diversity
- Mixing calibration from different hardware serial numbers
- Evaluating residuals on training data only

## Verification
Check transform closure, held-out reprojection or pose error, repeatability, physical sanity, and downstream localization/perception behavior.

## Expected output
Versioned calibration parameters and a validated transform tree with ownership and accuracy evidence.

## Stop conditions
Stop if the calibration setup is underconstrained, reference measurements are unreliable, hardware moved during capture, or results vary beyond acceptable repeatability.