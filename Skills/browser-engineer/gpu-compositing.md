# GPU and Compositing

## Purpose
Design and debug browser GPU acceleration, rasterization, surfaces, compositing, and graphics-resource lifecycles.

## When to use
Use for visual corruption, GPU crashes, scrolling/compositing regressions, high graphics memory, or accelerated feature work.

## Inputs
GPU traces, screenshots, driver/device info, layer tree, crash reports, rendering scenario.

## Context to inspect
GPU process, command submission, surfaces, textures, raster, synchronization, layer tree, device loss and fallback paths.

## Core knowledge
GPU work is asynchronous and driver-dependent. Resource synchronization and lifetime errors can cause corruption or hangs. Layer promotion can reduce repaint cost but increase memory and composition overhead.

## Procedure
1. Reproduce with exact GPU/driver configuration.
2. Determine whether failure originates before or after raster/compositing.
3. Inspect surface and resource ownership.
4. Trace synchronization and fence dependencies.
5. Check layer count, upload volume, and overdraw.
6. Exercise device loss and software fallback.
7. Minimize driver-specific assumptions.
8. Validate on representative GPU vendors and OSes.

## Decision points
Use GPU acceleration when workload and support justify complexity. Fall back safely when correctness or stability is uncertain. Avoid permanent denylisting without evidence and review.

## Common failure patterns
Resource reuse before completion; leaked textures; excessive layer promotion; vendor-specific workaround escaping scope; missing device-loss handling.

## Verification
Pixel tests, GPU integration tests, crash/hang stress, memory metrics, and multi-device validation pass.

## Expected output
A stable graphics fix or feature with explicit fallback and resource semantics.

## Stop conditions
Escalate unreproducible driver defects or changes requiring broad hardware policy modifications.