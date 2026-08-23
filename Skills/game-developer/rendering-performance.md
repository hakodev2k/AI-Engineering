# Rendering Performance

## Purpose
Diagnose and optimize rendering cost while preserving visual requirements and avoiding CPU/GPU trade-offs that merely move the bottleneck.

## When to use
Use for GPU-bound frames, excessive draw calls, overdraw, shader cost, fill-rate limits, visibility problems, or platform scaling.

## Inputs
Target hardware, frame budget, render pipeline, scenes, profiler/GPU captures, shaders, material counts, and visual quality requirements.

## Context to inspect
Inspect CPU render submission, GPU passes, batching/instancing, material variants, lighting, shadows, transparency, post-processing, resolution, and culling.

## Core knowledge
Rendering cost can be vertex-, pixel-, bandwidth-, synchronization-, or submission-bound. Draw-call reduction helps CPU submission but can increase GPU work or memory. Transparent overdraw and expensive full-screen effects often scale with resolution.

## Procedure
1. Confirm the frame is GPU or render-thread bound.
2. Capture representative GPU and CPU render traces.
3. Rank expensive passes and state changes.
4. Inspect visibility/culling and overdraw.
5. Reduce shader/material complexity where evidence supports it.
6. Evaluate batching, instancing, LOD, occlusion, and resolution scaling.
7. Tune shadows, lighting, and post effects by measured impact.
8. Validate visual quality and content workflows.
9. Re-profile on multiple target devices.

## Decision points
Use instancing for repeated compatible geometry; batching when submission overhead dominates and memory trade-offs are acceptable; dynamic resolution when fill-rate varies and image quality policy allows it.

## Common failure patterns
Chasing draw-call counts without bottleneck proof, disabling culling accidentally, shader variant explosion, excessive transparency, real-time shadows everywhere, and profiling only one camera angle.

## Verification
Compare GPU captures, frame-time percentiles, visual regression references, thermal behavior, and representative scenes.

## Expected output
Measured rendering improvements that meet target frame budgets without unacceptable visual regressions.

## Stop conditions
Stop when target visual requirements or hardware budgets are undefined, or profiling cannot isolate GPU passes.