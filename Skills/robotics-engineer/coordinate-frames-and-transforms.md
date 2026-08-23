# Coordinate Frames and Transforms

## Purpose
Define and maintain consistent spatial frames and transformations so sensing, planning, localization, and control operate on the same geometry.

## When to use
Use when introducing a new sensor, manipulator, mobile base, map, localization source, or debugging spatial misalignment.

## Inputs
Mechanical drawings, frame conventions, sensor mounts, kinematic chain, map/world definitions, transform sources, timestamps.

## Preconditions
Reference frames and physical mounting relationships are known or measurable.

## Context to inspect
Existing frame tree, static transforms, dynamic publishers, URDF/model data, localization outputs, axis conventions, transform timestamps.

## Core knowledge
Rigid transforms compose directionally and are time-dependent when bodies move. Frame naming, handedness, origin placement, timestamp semantics, and transform ownership must be unambiguous.

## Procedure
1. Inventory all frames and publishers.
2. Assign one semantic purpose to each frame.
3. Verify axis orientation and handedness.
4. Separate static from dynamic transforms.
5. Identify the authoritative publisher for each edge.
6. Confirm transform direction and composition order.
7. Validate timestamps against sensor data.
8. Check transform-tree connectivity and cycles.
9. Exercise known poses and compare expected coordinates.
10. Document conventions and invariants.

## Decision points
Use world/map/odom-style layered frames when global correction must not create discontinuous local control. Avoid duplicate transform publishers unless arbitration is explicit.

## Common failure patterns
Reversed transforms, duplicate publishers, stale timestamps, disconnected trees, mixed ENU/NED conventions, and frame names reused with different meanings.

## Verification
Transform known landmarks and tool points through the full chain and compare against measured geometry. Verify behavior across motion and localization resets.

## Expected output
Authoritative frame tree, documented conventions, validated transform publishers, and test cases.

## Stop conditions
Stop when mechanical reference data is contradictory or when multiple components claim ownership of the same transform without resolution.