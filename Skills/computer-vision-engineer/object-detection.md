# Object Detection

## Purpose
Build robust object detectors with localization, confidence, post-processing, and evaluation behavior aligned to production needs.

## When to use
Use when the system must identify and localize one or more object instances within an image or video frame.

## Inputs
Detection ontology, bounding-box annotations, production imagery, object-size distribution, error costs, latency target, and target hardware.

## Preconditions
Annotation policy for object boundaries, occlusion, truncation, ignore regions, and difficult examples is documented.

## Context to inspect
Inspect box quality, small-object prevalence, aspect ratios, crowding, class imbalance, anchor/query assumptions, input resolution, NMS/post-processing, and downstream consumers.

## Core knowledge
Detection quality depends on localization and classification jointly. IoU thresholds, AP/AR, confidence thresholds, non-maximum suppression, class-aware post-processing, feature scale, and annotation conventions materially affect results.

## Procedure
1. Audit annotation consistency and object-size distributions.
2. Establish a pretrained detector baseline.
3. Choose model scale and resolution based on target size and hardware.
4. Configure augmentations that preserve box semantics.
5. Train while monitoring localization and classification losses separately.
6. Evaluate AP/AR across classes, IoU thresholds, and object sizes.
7. Inspect missed, duplicate, misclassified, and poorly localized detections.
8. Tune confidence and NMS using validation data.
9. Test crowded, occluded, truncated, and low-light slices.
10. Benchmark preprocessing, model, and post-processing latency independently.
11. Verify exported-runtime numerical parity.
12. Add regression examples for costly failure modes.

## Decision points
Use one-stage detectors when latency and simplicity dominate; two-stage or heavier architectures when quality on difficult instances justifies cost. Increase resolution for small objects only after measuring memory/latency impact.

## Common failure patterns
Loose/inconsistent boxes, aggressive NMS suppressing nearby objects, test-set threshold tuning, resizing that erases small targets, and reporting mAP without operational precision/recall at the deployed threshold.

## Verification
Verify per-class and size-slice metrics, threshold behavior, post-processing parity, target-hardware performance, and representative visual regression tests.

## Expected output
A versioned detector, threshold/NMS policy, error analysis, latency profile, and deployment contract.

## Stop conditions
Stop if annotation geometry is inconsistent, required objects are below usable sensor resolution, or safety-critical recall cannot be demonstrated.