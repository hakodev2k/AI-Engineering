# Build and Toolchain Reproducibility Rules

## Purpose
Make firmware artifacts traceable and reproducible across development and release environments.

## Scope
Compilers, linkers, SDKs, generators, build flags, linker scripts, dependencies, and artifact metadata.

## MUST
- Pin or otherwise control release-relevant toolchain and dependency versions.
- Record source revision, build configuration, target, and toolchain identity for release artifacts.
- Review linker scripts and optimization/build-flag changes as behavior-affecting changes.

## MUST NOT
- Release an artifact whose source/configuration provenance cannot be reconstructed.
- Silently change compiler, ABI, or optimization settings in production builds.

## SHOULD
- Automate clean builds in CI and compare reproducibility where practical.

## Exceptions
Emergency toolchain changes require compatibility evidence and explicit release approval.

## Verification
Perform clean CI builds, inspect artifact metadata/map files, dependency locks, and documented release provenance.