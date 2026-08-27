# Rendering Pipeline

## Purpose
Diagnose and improve style, layout, paint, raster, and compositing behavior while preserving visual correctness.

## When to use
Use for rendering bugs, jank, invalidation problems, excessive repainting, or new visual features.

## Inputs
Page/repro, screenshots, traces, DOM/CSS state, layer and paint diagnostics, performance targets.

## Context to inspect
Style recalculation, layout tree, invalidation, display lists, raster tasks, compositor layers, frame scheduling.

## Core knowledge
Rendering cost is determined by dependency invalidation and work per frame, not merely DOM size. Layout dependencies can propagate; paint and compositing have different CPU/GPU and memory trade-offs.

## Procedure
1. Establish expected pixels and timing budget.
2. Capture a rendering trace.
3. Locate style, layout, paint, raster, or composite bottleneck.
4. Inspect invalidation causes and affected subtree.
5. Check forced synchronous layout and repeated measurements.
6. Inspect layer promotion and memory cost.
7. Make the smallest correctness-preserving change.
8. Compare frame time, invalidation scope, and memory.
9. Test zoom, scrolling, transforms, high-DPI, and dynamic updates.

## Decision points
Promote layers only when compositing benefit exceeds memory and upload cost. Prefer containment when semantics allow. Avoid caching stale geometry merely to suppress layout.

## Common failure patterns
Layout thrashing; over-invalidation; excessive layers; blurry raster scaling; stale paint properties; optimization without trace evidence.

## Verification
Pixel tests, rendering regression tests, trace comparison, smoothness metrics, and memory checks must all pass.

## Expected output
A verified rendering fix or optimization with measured evidence.

## Stop conditions
Stop if expected rendering is undefined, platform graphics behavior cannot be reproduced, or the fix requires violating web compatibility.