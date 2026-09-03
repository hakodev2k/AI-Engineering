# Rendering and Perception Simulation

## Purpose
Configure rendering for robotics perception so synthetic images preserve task-relevant optics, geometry, visibility, illumination, and artifacts rather than optimizing only visual appearance.

## When to use
Use for camera-based perception, synthetic training data, visual localization, detection/segmentation evaluation, or debugging sim-to-real vision gaps.

## Inputs
Camera calibration, lens model, exposure settings, scene assets, lighting measurements, perception metrics, real image samples, GPU budget.

## Preconditions
Camera intrinsics/extrinsics and scene geometry must be credible.

## Context to inspect
Projection model, distortion, rolling/global shutter, motion blur, exposure, tone mapping, materials, lighting, shadows, transparency, depth, occlusion, noise, and renderer version.

## Core knowledge
Photorealism is not synonymous with perception fidelity. Downstream model behavior determines which rendering effects matter. Geometry, calibration, visibility, label consistency, and domain statistics can outweigh expensive global illumination.

## Procedure
1. Define perception tasks and failure-sensitive visual factors.
2. Match camera projection, resolution, clipping, and calibration.
3. Validate geometric alignment and ground-truth labels.
4. Establish simple lighting/material baseline.
5. Compare synthetic and real image statistics by relevant slices.
6. Measure downstream perception performance, not just pixel similarity.
7. Add lens, exposure, blur, or illumination effects only when they explain measured gaps.
8. Parameterize deployment-relevant variation.
9. Hold out real and synthetic conditions for evaluation.
10. Version renderer, shaders, assets, and camera parameters.

## Decision points
Use rasterization for high-throughput geometry-driven workloads; use ray/path tracing when reflections, transparency, shadows, or lighting transport materially influence perception. Prefer empirical augmentation when full optical modeling offers little incremental value.

## Common failure patterns
Optimizing screenshots instead of model behavior; incorrect intrinsics; perfect labels misaligned with rendered pixels; unrealistic lighting distributions; synthetic-only validation; hidden renderer changes.

## Verification
Check calibration projections, label alignment, occlusion, depth consistency, rendering statistics, throughput, and downstream perception metrics against real held-out data.

## Expected output
A versioned perception-rendering configuration with fidelity evidence, performance cost, domain gaps, and valid use cases.

## Stop conditions
Escalate when real data is unavailable for validation or rendering artifacts dominate the target perception task.