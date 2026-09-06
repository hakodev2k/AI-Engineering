# Dependency and Supply Chain Control

## Purpose
Control release risk from model files, tokenizers, runtimes, containers, libraries, plugins, and third-party artifacts used in AI serving.

## When to use
Use when packaging or promoting a release, especially after dependency or base-image changes.

## Inputs
Dependency manifests, lockfiles, container manifests, model sources, checksums/signatures, vulnerability results, licenses, and build metadata.

## Preconditions
Dependencies can be enumerated and versions can be pinned.

## Context to inspect
Inspect transitive packages, model download mechanisms, custom code loading, serialization formats, container bases, build provenance, and external registries.

## Core knowledge
AI artifacts may execute code through unsafe loaders or custom model repositories. Mutable dependencies undermine reproducibility. Supply-chain controls should combine provenance, pinning, scanning, integrity checks, and constrained execution.

## Procedure
1. Enumerate direct and transitive release dependencies.
2. Pin versions and immutable artifact digests.
3. Verify trusted sources and integrity metadata.
4. Avoid unsafe deserialization or remote-code execution unless explicitly reviewed.
5. Scan libraries, images, and system packages for vulnerabilities.
6. Review license and distribution constraints.
7. Generate or update an SBOM where supported.
8. Rebuild from controlled inputs and compare artifacts.
9. Define patch response for critical dependency vulnerabilities.

## Decision points
Vendor a dependency when external availability or mutability is unacceptable; otherwise prefer standard registries with strong provenance. Accept a vulnerability only with documented exploitability analysis and compensating controls.

## Common failure patterns
Floating tags, downloading models at runtime, `trust_remote_code` without review, stale base images, ignored transitive vulnerabilities, and provenance that ends at the application repository.

## Verification
Reproduce the dependency graph from lockfiles, verify digests, inspect scan results, and confirm production loads only approved artifacts.

## Expected output
A controlled dependency inventory with provenance, integrity, vulnerability, and exception evidence.

## Stop conditions
Stop on untrusted artifacts, unresolved critical vulnerabilities, ambiguous licenses, or dependencies that cannot be pinned or verified.
