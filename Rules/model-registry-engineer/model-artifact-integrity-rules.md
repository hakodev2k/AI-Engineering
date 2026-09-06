# Model Artifact Integrity Rules

## Purpose
Ensure every registered model artifact is immutable, identifiable, and verifiably identical to the artifact approved by upstream validation and downstream deployment systems.

## Scope
Serialized models, weights, tokenizers, preprocessing artifacts, auxiliary files, manifests, checksums, packaging, and registry storage.

## MUST
- Every registered model artifact MUST have an immutable content identifier or cryptographic digest.
- Registry metadata MUST record the artifact format, size, creation source, and producing pipeline or build identifier.
- Artifact upload completion MUST be verified before the version is made available to consumers.
- Multi-file model packages MUST have a manifest that binds all required files to one model version.
- Downloaded artifacts MUST be verifiable against the registered digest before deployment or evaluation.

## MUST NOT
- Registered production artifacts MUST NOT be modified in place.
- A model version MUST NOT point to mutable storage without an integrity control that detects replacement.
- Failed or partial uploads MUST NOT be exposed as valid model versions.

## SHOULD
- Prefer content-addressed storage for large immutable artifacts.
- Keep artifact verification automatic in CI/CD and deployment tooling.

## Exceptions
Any exception requires documented technical constraint, compensating integrity control, risk assessment, and approval by the registry owner.

## Verification
Inspect artifact digests, manifests, upload-state handling, immutability controls, and deployment-side digest verification tests.