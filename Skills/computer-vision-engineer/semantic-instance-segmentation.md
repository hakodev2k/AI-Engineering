# Semantic and Instance Segmentation

## Purpose
Design segmentation systems that produce spatially precise class or instance masks with error behavior suitable for downstream geometry-sensitive decisions.

## When to use
Use when pixel-level region extent matters, such as inspection, scene understanding, medical imagery, mapping, robotics, or measurement.

## Inputs
Mask annotations, ontology, boundary-quality requirements, object-size distribution, production imagery, downstream geometry needs, and compute constraints.

## Preconditions
The project clearly distinguishes semantic, instance, and panoptic requirements and has a consistent policy for boundaries, overlaps, void regions, and occlusions.

## Context to inspect
Inspect mask quality, rasterization, class imbalance, thin structures, small objects, boundary ambiguity, crop/resize effects, output resolution, and post-processing.

## Core knowledge
IoU/Dice can hide boundary failures and small-region errors. Losses, decoder resolution, multi-scale features, connected components, mask thresholds, and annotation granularity influence production usefulness.

## Procedure
1. Confirm whether semantic, instance, or panoptic output is required.
2. Audit annotation topology and boundary consistency.
3. Quantify class area and small-structure prevalence.
4. Establish an appropriate pretrained baseline.
5. Choose output stride/resolution based on geometry needs.
6. Train with losses suited to imbalance and region size.
7. Evaluate class IoU/Dice plus boundary and small-object metrics when relevant.
8. Inspect fragmentation, merging, holes, edge errors, and missed regions.
9. Test resizing and post-processing against original-resolution geometry.
10. Measure downstream task impact, not only mask metrics.
11. Benchmark memory and latency on target hardware.
12. Preserve hard examples as regression tests.

## Decision points
Prefer semantic segmentation when identities do not matter; instance segmentation when separate objects do. Add boundary-aware objectives only when boundary quality is operationally important and evidence supports the complexity.

## Common failure patterns
Ignoring void labels, masks misaligned after augmentation, large regions dominating mean metrics, excessive morphological post-processing, and evaluation at resized resolution hiding geometric error.

## Verification
Verify mask alignment, per-class and boundary metrics, downstream geometry accuracy, runtime parity, and visual regression on critical slices.

## Expected output
A segmentation model with documented mask semantics, evaluation suite, post-processing policy, and deployment constraints.

## Stop conditions
Stop if annotation boundaries are too ambiguous for required precision, sensor resolution cannot support the geometry, or downstream tolerance is undefined.