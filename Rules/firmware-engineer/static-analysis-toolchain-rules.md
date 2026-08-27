# Static Analysis and Toolchain

## Purpose
Control compiler, linker, analyzer, and build-system risks.

## Scope
Compilers, linkers, warnings, static analyzers, build flags, and generated binaries.

## MUST
- Production toolchain versions and material flags MUST be controlled and reproducible.
- Compiler warnings designated by the project as release-blocking MUST be resolved or formally waived.
- Undefined or implementation-defined language behavior used intentionally MUST be documented and validated for the target toolchain.
- Static analysis findings with safety or security impact MUST be triaged before release.
- Linker scripts and memory maps MUST be reviewed when memory layout changes.

## MUST NOT
- Warning suppression MUST NOT hide unrelated diagnostics.
- Optimization MUST NOT be disabled globally to conceal correctness defects.

## SHOULD
- Builds SHOULD be reproducible enough to trace a production image to source, configuration, and toolchain.

## Exceptions
Waivers require rationale, scope, evidence, expiry/review conditions, and owner.

## Verification
Run clean production builds, analyzers, map-file checks, warning gates, and artifact provenance checks.