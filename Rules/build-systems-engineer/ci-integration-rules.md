# CI Integration Rules

## Purpose
Ensure CI invokes the build system consistently, with clear ownership, deterministic configuration, and actionable failure reporting.

## Scope
Applies to CI workflows, presubmit builds, post-submit builds, matrix execution, retries, and build status reporting.

## MUST
- CI MUST invoke supported build entry points rather than duplicating build logic in pipeline configuration.
- CI configuration MUST pin or resolve the same toolchain and dependency versions used by the build system.
- Required checks MUST map to explicit quality or release gates.
- CI retries MUST distinguish infrastructure failures from deterministic build failures.
- Build failures MUST preserve enough diagnostics to identify the failing target and execution phase.

## MUST NOT
- MUST NOT maintain a separate CI-only dependency graph that diverges from local build semantics.
- MUST NOT mark deterministic failures successful through automatic retry.
- MUST NOT bypass required build checks without documented approval.

## SHOULD
- CI SHOULD reuse build caches without compromising isolation or correctness.
- Pipeline stages SHOULD expose queue and execution latency separately.

## Exceptions
Any CI-only deviation MUST document why it cannot be represented in normal build configuration, its owner, and verification strategy.

## Verification
Inspect workflow definitions, build entry points, retry classification, required check configuration, and parity tests between local and CI execution.