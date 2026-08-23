# Camera Calibration and Imaging Pipeline

## Purpose
Validate camera geometry and image-formation assumptions so downstream vision models receive stable, interpretable inputs.

## When to use
Use during camera bring-up, device changes, geometric vision work, or unexplained cross-device regressions.

## Inputs
Camera hardware, calibration targets, raw frames, ISP settings, intrinsics/extrinsics requirements.

## Preconditions
Capture settings and target geometry are known.

## Context to inspect
Lens distortion, focus, exposure, white balance, rolling shutter, ISP transforms, resolution, crop, orientation, timestamps.

## Core knowledge
Model errors may originate in optics or the imaging pipeline. Calibration parameters are valid only for the physical/capture configuration they describe.

## Procedure
1. Inspect raw and processed frame characteristics.
2. Verify orientation, color, resolution, and crop contracts.
3. Capture calibration data across image regions and poses.
4. Estimate intrinsics/distortion and extrinsics where needed.
5. Review reprojection residuals and outliers.
6. Validate parameters on independent captures.
7. Version calibration with hardware identity.
8. Add runtime checks for incompatible configurations.

## Decision points
Per-device vs factory calibration; online refinement vs fixed calibration; rectification cost vs downstream tolerance.

## Common failure patterns
Reusing calibration after resolution/crop changes, weak target coverage, ignored ISP changes, stale extrinsics.

## Verification
Check reprojection error, geometric measurements, repeatability, and downstream performance across representative devices.

## Expected output
Calibration artifacts, imaging contract, validation evidence, and applicability limits.

## Stop conditions
Stop when hardware instability or capture settings prevent repeatable calibration.