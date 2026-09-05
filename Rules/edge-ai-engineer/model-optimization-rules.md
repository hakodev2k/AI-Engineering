# Model Optimization Rules

## Purpose
Ensure edge model optimization preserves required behavior while reducing deployment cost.

## Scope
Graph optimization, operator fusion, compilation, sparsity, compression, and edge-specific model transforms.

## MUST
- Every optimization MUST be evaluated against the unoptimized baseline for quality and runtime behavior.
- Optimization settings and toolchain versions MUST be reproducible.
- Unsupported operators or fallback-to-host execution MUST be detected before release.
- Optimization claims MUST include before/after measurements on representative hardware.

## MUST NOT
- MUST NOT accept a smaller or faster artifact solely because it builds successfully.
- MUST NOT hide quality regressions behind aggregate metrics when critical slices regress.

## SHOULD
- Prefer optimizations that preserve portability unless a device-specific path has measurable value.

## Exceptions
Require evidence, affected scenarios, mitigation, and approval when quality or portability trade-offs are accepted.

## Verification
Review benchmark reports, quality comparisons, compiled graphs, operator placement, and reproducible build configuration.