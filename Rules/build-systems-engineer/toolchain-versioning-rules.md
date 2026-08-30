# Toolchain Versioning Rules

## Purpose
Control compiler, linker, runtime, code generator, package manager, and auxiliary tool versions so builds remain predictable and upgrades are reviewable.

## Scope
Applies to all build-time tools whose behavior can affect outputs, diagnostics, compatibility, or performance.

## MUST
- Toolchain versions MUST be declared in version-controlled configuration or an equivalent auditable source of truth.
- Upgrades MUST identify compatibility changes, migration requirements, rollback path, and affected platforms.
- Different toolchain versions MUST NOT share cache namespaces unless output compatibility is proven.
- Security-critical tool upgrades MUST be prioritized according to documented risk.
- Toolchain bootstrap MUST verify expected versions before executing production build paths.

## MUST NOT
- MUST NOT silently consume the latest available compiler or package manager in CI.
- MUST NOT rely on developer-installed tool versions when a managed version is required by the project.
- MUST NOT perform a broad toolchain migration without representative validation.

## SHOULD
- Major upgrades SHOULD be staged and benchmarked for correctness, diagnostics, build time, and artifact differences.
- Deprecated versions SHOULD have explicit retirement criteria.

## Exceptions
Temporary mixed-version operation MUST document compatibility boundaries, duration, monitoring, and the owner responsible for convergence.

## Verification
Inspect version manifests, bootstrap logs, cache namespaces, upgrade test results, artifact comparisons, and CI worker configuration.