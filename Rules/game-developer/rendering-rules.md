# Rendering Rules

## Purpose
Deliver correct visual output within GPU, CPU, memory, and platform constraints.

## Scope
Render pipelines, materials, shaders, draw submission, post-processing, resolution, and graphics features.

## MUST
- Rendering changes MUST be profiled on representative target GPUs when they affect frame cost materially.
- Shader variants and material features MUST be controlled to prevent unbounded build/runtime cost.
- Graphics settings MUST preserve functional readability when quality is reduced.
- GPU resource lifetime and synchronization MUST follow engine/platform contracts.

## MUST NOT
- MUST NOT infer GPU bottlenecks from CPU timing alone.
- MUST NOT add expensive full-screen, transparency, shadow, or overdraw-heavy effects without budget evidence.

## SHOULD
- Scalable effects SHOULD expose quality tiers aligned with measurable costs.
- Rendering fallbacks SHOULD be defined for unsupported capabilities.

## Exceptions
Platform-exclusive visual features require explicit compatibility boundaries.

## Verification
Use GPU captures, frame analyzers, shader statistics, overdraw inspection, target-device testing, and visual regression checks.