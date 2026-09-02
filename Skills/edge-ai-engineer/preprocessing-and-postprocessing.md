# Preprocessing and Postprocessing

## Purpose
Implement device-side transformations around inference so deployed inputs and outputs preserve the semantics used during training and evaluation while meeting edge performance constraints.

## When to use
Use when porting models, optimizing image/audio/text transforms, changing sensors, fusing kernels, or diagnosing quality differences between offline and device inference.

## Inputs
Training preprocessing code, model input/output contract, sensor formats, normalization constants, label maps, thresholds, target hardware, and representative samples.

## Preconditions
Obtain golden examples from the trusted training/evaluation pipeline.

## Context to inspect
Resize/crop semantics, interpolation, color spaces, channel order, normalization, resampling, tokenization, padding, tensor layout, decoding, NMS, thresholding, and coordinate transforms.

## Core knowledge
Small semantic differences before or after inference can cause large quality regressions. Resize rounding, RGB/BGR swaps, audio resampling, zero-point handling, NMS behavior, and coordinate remapping are common sources. Optimized kernels are acceptable only when they are numerically and semantically equivalent within defined tolerance.

## Procedure
1. Write the preprocessing and postprocessing contracts explicitly.
2. Capture golden raw inputs, tensors, raw model outputs, and final outputs.
3. Implement the simplest correct device path first.
4. Compare intermediate tensors against golden references.
5. Validate output decoding and coordinate/unit conversions.
6. Profile each transformation and memory copy.
7. Fuse or accelerate expensive stages only after correctness is proven.
8. Revalidate on boundary cases such as extreme aspect ratios, silence, clipping, empty detections, and threshold ties.
9. Lock constants, label maps, and transform versions with the model artifact.
10. Add conformance tests to deployment CI.

## Decision points
Prefer exact semantic parity over small preprocessing speedups. Use approximate kernels only when quality impact is measured and approved. Move transforms into the model graph when it improves portability without reducing observability or flexibility.

## Common failure patterns
Different interpolation algorithms, integer overflow, stale label maps, threshold drift, coordinates mapped to the wrong crop, duplicated normalization, and testing only final predictions rather than intermediate tensors.

## Verification
Compare stage-by-stage outputs with golden vectors and benchmark end-to-end latency and memory on target devices.

## Expected output
A versioned transformation pipeline with proven semantic equivalence and measured device cost.

## Stop conditions
Stop when the original training transformation cannot be reconstructed or device approximations exceed accepted numerical/quality tolerance.