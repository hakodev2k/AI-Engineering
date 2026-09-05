# Artifact Integrity Rules

## Purpose
Ensure edge devices execute only trusted, intact, and traceable model artifacts.

## Scope
Model files, tokenizers, compiled assets, configuration bundles, and update packages.

## MUST
- Every production artifact MUST have an immutable identity such as a digest or versioned registry reference.
- Device activation MUST verify artifact integrity before use where technically supported.
- Artifact provenance MUST trace to the approved build, source model, and evaluation evidence.
- Corrupt or mismatched artifacts MUST fail closed and trigger safe recovery.

## MUST NOT
- MUST NOT rely on mutable filenames or tags as the sole production identity.
- MUST NOT activate an artifact whose origin cannot be established.

## SHOULD
- Use signatures or attestations when the platform supports them.

## Exceptions
Require documented reason, compensating controls, affected scope, and approval.

## Verification
Inspect digests, signatures, update manifests, build records, and corruption-recovery tests.