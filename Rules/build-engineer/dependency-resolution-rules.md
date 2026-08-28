# Dependency Resolution Rules

## Purpose
Keep dependency resolution deterministic, secure, and compatible across supported build environments.

## Scope
Applies to package managers, lockfiles, registries, mirrors, transitive dependencies, and dependency graph resolution.

## MUST
- Dependency resolution for release builds MUST be reproducible from committed manifests and lock data.
- Registry and mirror configuration MUST be explicit and authenticated where required.
- Transitive dependency changes MUST be reviewable through lockfile or equivalent graph diffs.
- Dependency updates MUST preserve supported platform and toolchain compatibility.
- Integrity metadata such as checksums or signed metadata MUST be validated when supported.

## MUST NOT
- MUST NOT depend on mutable unpinned branches or floating revisions for release-critical builds.
- MUST NOT bypass integrity verification merely to unblock a build.
- MUST NOT allow resolver fallback to unapproved registries without explicit configuration.

## SHOULD
- Dependency graphs SHOULD be periodically reviewed for obsolete, duplicated, or conflicting packages.
- Resolution failures SHOULD expose actionable diagnostics rather than generic errors.

## Exceptions
Exceptions require documented source trust, bounded duration, impact analysis, and approval for release-critical dependencies.

## Verification
Run clean resolution in isolated workers, inspect lockfile diffs, validate registry configuration, and compare effective dependency graphs across environments.