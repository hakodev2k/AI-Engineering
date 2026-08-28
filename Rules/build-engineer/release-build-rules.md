# Release Build Rules

## Purpose
Ensure release builds are controlled, traceable, and distinct from ad hoc developer builds.

## Scope
Applies to release configuration, optimization flags, versioning, symbols, provenance, reproducibility, and artifact promotion.

## MUST
- Release builds MUST originate from an approved source revision and declared release configuration.
- Release-specific compiler, linker, and packaging flags MUST be version-controlled and reviewable.
- Produced artifacts MUST be traceable to source revision, toolchain, and build configuration.
- Release build failures or unexplained artifact differences MUST block promotion until resolved or explicitly approved.
- Debug symbols and diagnostic metadata MUST be handled according to platform and security requirements.

## MUST NOT
- MUST NOT publish artifacts produced from uncommitted local state.
- MUST NOT manually modify binaries or packages after the controlled build step.
- MUST NOT weaken validation or optimization settings without documented release approval.

## SHOULD
- Release builds SHOULD run in isolated, reproducible environments.
- Artifact promotion SHOULD reuse already verified outputs rather than rebuilding from source at each stage.

## Exceptions
Exceptions require documented business urgency, risk analysis, independent verification, and human approval.

## Verification
Inspect provenance, source revision, toolchain records, release configuration, artifact digests, and promotion logs.