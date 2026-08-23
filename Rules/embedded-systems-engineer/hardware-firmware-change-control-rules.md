# Hardware-Firmware Change Control Rules

## Purpose
Control compatibility risk when hardware and firmware evolve independently.

## Scope
Board revisions, BOM substitutions, silicon revisions, pin changes, calibration, feature detection, and compatibility matrices.

## MUST
- Identify hardware revision at runtime or by controlled build/configuration when behavior differs materially.
- Assess firmware impact for component substitutions and board changes before release.
- Maintain compatibility evidence for supported hardware/firmware combinations.

## MUST NOT
- Assume a BOM-equivalent component is behaviorally identical without validating relevant characteristics.
- Ship firmware to an unsupported hardware revision without explicit compatibility handling.

## SHOULD
- Design revision detection and capability discovery to avoid fragile compile-time forks where practical.

## Exceptions
Temporary single-revision support requires documented scope and deployment controls.

## Verification
Review schematics/BOM deltas, compatibility matrix, revision detection, calibration data, and regression tests on affected hardware.