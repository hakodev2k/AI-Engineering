# Build Reproducibility

## Purpose
Make builds deterministic enough that the same declared source and inputs produce trustworthy equivalent artifacts.

## When to use
Use when hardening CI, investigating artifact drift, satisfying provenance requirements, or reducing environment-specific build failures.

## Inputs
Build definitions, source revision, toolchains, dependencies, base images, environment variables, timestamps, generated assets, and package sources.

## Preconditions
A build can be executed in a controlled environment and its external inputs can be observed.

## Context to inspect
Inspect lock files, compiler/runtime versions, container bases, package feeds, generated code, locale/timezone assumptions, network downloads, caches, and embedded metadata.

## Core knowledge
Reproducibility depends on pinning or recording every meaningful input. Bit-for-bit equality is ideal but not always practical; define the required reproducibility level and separate harmless metadata variance from behavioral variance.

## Procedure
1. Enumerate all build inputs, including implicit environment inputs.
2. Pin toolchains and dependency resolution where appropriate.
3. Remove uncontrolled network and mutable dependency inputs.
4. Normalize locale, timezone, ordering, and generated timestamps where feasible.
5. Build from a clean environment twice.
6. Compare outputs and isolate differences.
7. Record provenance for unavoidable variable inputs.
8. Make build environments disposable and scripted.
9. Add checks for lockfile or toolchain drift.
10. Periodically reproduce historical release candidates.

## Decision points
Require bit-for-bit reproducibility for high-assurance artifacts when feasible; otherwise require functionally equivalent artifacts plus complete provenance. Balance pinning with timely security updates through controlled dependency refresh.

## Common failure patterns
Unpinned base images, hidden local tools, mutable package feeds, generated files depending on clock or filesystem order, cache masking missing dependencies, and production builds performed on developer machines.

## Verification
Run independent clean builds, compare artifacts or normalized contents, confirm declared inputs are sufficient, and verify CI can rebuild without undeclared local state.

## Expected output
A controlled build process with documented inputs, reproducibility evidence, and known exceptions.

## Stop conditions
Stop if critical dependencies are mutable and cannot be archived or pinned, proprietary build inputs are unavailable, or reproducibility requirements conflict with mandatory tooling behavior without an approved exception.