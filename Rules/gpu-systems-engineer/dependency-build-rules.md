# GPU Dependency and Build Rules

## Purpose
Keep accelerator builds reproducible, compatible, reviewable, and secure.

## Scope
Compilers, SDKs, runtime libraries, kernel libraries, build flags, generated binaries, and dependencies.

## MUST
- Production build inputs and material toolchain versions MUST be pinned or reproducibly resolved.
- Architecture targets and fallback code generation MUST match the declared support matrix.
- Dependency upgrades MUST be checked for correctness, performance, compatibility, and security impact.
- Performance-affecting compiler flags MUST be explicit and reviewed.
- Build artifacts MUST be traceable to source revision and toolchain metadata.

## MUST NOT
- MUST NOT depend on unreviewed binary blobs from untrusted sources.
- MUST NOT enable unsafe optimization flags without validating numerical and memory correctness.
- MUST NOT perform large toolchain migrations directly in production without staged validation.

## SHOULD
- Cache deterministic build artifacts while preserving provenance.
- Automate dependency and vulnerability scanning where supported.

## Exceptions
Emergency dependency changes require documented reason, narrowed scope, validation evidence, rollback, and approval.

## Verification
Inspect lockfiles/manifests, build metadata, binary targets, CI reproducibility, scanner results, and upgrade benchmarks.