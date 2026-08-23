# Dependency Management and Build System

## Purpose
Manage Swift packages/frameworks and Xcode build configuration for reproducible, secure, maintainable iOS builds.

## When to use
Use for adding/upgrading dependencies, modularization, build failures, slow builds, or configuration drift.

## Inputs
Dependency need, version constraints, licenses/security requirements, target graph, build configurations.

## Context to inspect
Package.resolved, SPM manifests, Xcode targets/settings, scripts/plugins, linker flags, generated code, CI environment.

## Core knowledge
Every dependency adds supply-chain, binary-size, compatibility, and maintenance cost. Build settings should be explicit and reproducible across local/CI/archive contexts.

## Procedure
1. Confirm the capability cannot be reasonably implemented with existing/platform APIs.
2. Evaluate dependency maintenance, security, license, size, transitive graph, and minimum OS impact.
3. Pin versions according to update policy.
4. Keep target dependencies acyclic and minimal.
5. Remove redundant build settings/scripts.
6. Ensure generated artifacts have deterministic inputs.
7. Test clean resolve/build/archive.
8. Measure build-time/binary-size changes for material additions.
9. Document ownership and upgrade path.

## Decision points
Prefer source packages for transparency when build cost is acceptable; binaries when vendor constraints or build economics justify them.

## Common failure patterns
Unbounded version ranges, duplicate libraries, hidden script network access, configuration-only failures, and abandoned dependencies.

## Verification
Clean checkout resolves and builds in CI, tests/archive succeed, and dependency/security scans show no unexplained issues.

## Expected output
Reproducible dependency graph and build configuration with documented trade-offs.

## Stop conditions
Stop on unresolved licensing/security risk or dependency requiring unsupported platform/toolchain versions.