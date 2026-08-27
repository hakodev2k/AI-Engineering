# GPU Testing and Validation Rules

## Purpose
Provide layered regression protection for accelerator correctness, compatibility, performance, and failure behavior.

## Scope
Unit, differential, integration, stress, compatibility, performance, and fault tests.

## MUST
- Critical kernels MUST have correctness tests against a trusted reference or invariant.
- Tests MUST include boundary shapes, zero/degenerate cases where legal, and non-aligned dimensions.
- Supported device/runtime combinations MUST receive compatibility validation.
- Performance-sensitive paths MUST have regression measurements with controlled variance.
- Failure and recovery paths MUST be exercised for production-critical systems.

## MUST NOT
- MUST NOT mark flaky GPU tests as acceptable without bounded investigation and ownership.
- MUST NOT widen numerical tolerances merely to hide regressions.
- MUST NOT make correctness tests depend on unspecified execution ordering.

## SHOULD
- Use randomized differential testing for complex kernels.
- Separate correctness gates from noisy performance diagnostics while keeping both visible.

## Exceptions
Unavailable hardware may defer a matrix cell only with documented coverage gap and alternate validation.

## Verification
Inspect CI results, test matrices, sanitizer runs, reference comparisons, stress/fault tests, and benchmark history.