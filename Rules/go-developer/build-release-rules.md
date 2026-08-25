# Build and Release Rules

## Purpose
Ensure Go artifacts are reproducible, traceable, and safe to promote.

## Scope
Builds, compiler/toolchain versions, flags, artifacts, CI, release metadata, and rollback.

## MUST
- Release artifacts MUST be built from traceable source revisions using controlled toolchain/dependency inputs.
- CI MUST run required tests and static checks before promotion.
- Build-time metadata MUST not inject secrets into binaries.
- Release changes MUST have a rollback or forward-recovery strategy appropriate to risk.

## MUST NOT
- MUST NOT release unreviewed local binaries as production artifacts.
- MUST NOT bypass failed quality/security gates without documented human approval.
- MUST NOT rely on mutable unpinned build inputs where reproducibility is required.

## SHOULD
- Embed non-sensitive version/revision metadata for diagnostics.
- Keep build flags and cross-compilation targets explicit and tested.

## Exceptions
Emergency releases require recorded approver, skipped controls, compensating verification, and follow-up.

## Verification
Rebuild comparison where applicable, CI records, artifact provenance, smoke tests, dependency metadata, and rollback rehearsal/evidence.