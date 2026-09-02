# Sensor Data Pipelines

## Purpose
Build deterministic, resource-bounded pipelines that acquire sensor data, preserve timing and calibration semantics, transform it for inference, and prevent stale or misaligned inputs from corrupting decisions.

## When to use
Use for camera, microphone, IMU, radar, lidar, or multimodal edge inference; when changing sensor drivers; or when diagnosing inconsistent model behavior between lab and device.

## Inputs
Sensor specifications, driver APIs, sampling rates, timestamps, calibration data, preprocessing requirements, model input contract, and latency budget.

## Preconditions
Define clock sources, units, coordinate conventions, expected rates, and acceptable data age.

## Context to inspect
Driver buffering, DMA paths, image/audio formats, timestamp generation, synchronization, frame drops, preprocessing kernels, queues, and memory ownership.

## Core knowledge
Sensor correctness is part of model correctness. Exposure, gain, sample rate, color conversion, resampling, calibration, timestamp drift, and stale frames can change model input distributions. Buffers must have bounded ownership and explicit drop/backpressure semantics.

## Procedure
1. Trace data from physical sensor to model tensor.
2. Document formats, units, clocks, and transformations at every boundary.
3. Measure capture-to-tensor latency and jitter.
4. Validate calibration and preprocessing against training assumptions.
5. Bound all queues and define oldest/newest/drop behavior.
6. Preserve timestamps through transformations.
7. Synchronize multimodal streams using an explicit tolerance window.
8. Detect missing, stale, duplicated, and out-of-order samples.
9. Minimize copies using safe ownership or zero-copy APIs where supported.
10. Test sensor restart, hot-plug, rate change, and degraded-quality conditions.
11. Log enough metadata to replay representative inputs.

## Decision points
Drop stale data rather than increasing latency for real-time decisions. Buffer more deeply only when downstream consumers explicitly value completeness over freshness. Synchronize approximately when exact alignment is impossible and quantify the error budget.

## Common failure patterns
Unbounded queues, timestamps created after buffering, training/deployment preprocessing mismatch, silent frame duplication, wrong color/channel order, and assuming sensor defaults remain stable across firmware.

## Verification
Compare device tensors to trusted preprocessing outputs, measure data age and rate, inject drops/reordering, and replay captured samples through the inference pipeline.

## Expected output
A documented, bounded sensor pipeline with timing, calibration, transformation, and failure semantics verified.

## Stop conditions
Stop when sensor timing/calibration cannot be established or data freshness cannot meet the downstream decision requirement.