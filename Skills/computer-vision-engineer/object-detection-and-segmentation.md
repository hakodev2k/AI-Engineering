# Object Detection and Segmentation

## Purpose
Engineer detection and segmentation models with correct geometry, post-processing, metrics, and deployment behavior.

## When to use
Use for localization, instance segmentation, semantic segmentation, or dense scene understanding.

## Inputs
Annotated images, ontology, size distribution, latency budget, target metrics.

## Preconditions
Bounding-box/mask semantics and ignore regions are defined.

## Context to inspect
Object scale, occlusion, class imbalance, annotation density, anchor/query design, NMS or mask post-processing.

## Core knowledge
IoU thresholds, confidence thresholds, class imbalance, small-object resolution, and post-processing materially change operational performance.

## Procedure
1. Profile object sizes and annotation density.
2. Establish a strong baseline at a suitable resolution.
3. Select architecture based on latency and scene complexity.
4. Tune sampling/losses only from measured failure modes.
5. Evaluate AP plus task-specific precision/recall at operating thresholds.
6. Inspect localization and confusion errors.
7. Test crowded, occluded, and small-object cases.
8. Benchmark post-processing cost and determinism.

## Decision points
One-stage vs two-stage; boxes vs masks; class-agnostic vs class-aware NMS; model size vs input resolution.

## Common failure patterns
Optimizing mAP without operating thresholds, incorrect box transforms, label leakage, ignoring small objects, mismatched NMS between environments.

## Verification
Reproduce metric curves, validate geometry visually, benchmark end-to-end inference, and test threshold behavior.

## Expected output
Model, threshold policy, evaluation report, failure taxonomy, and serving requirements.

## Stop conditions
Stop when annotation geometry is unreliable or target recall cannot be achieved within compute constraints.