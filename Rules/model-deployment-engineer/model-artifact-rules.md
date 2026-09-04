# Model Artifact Rules

## Purpose
Ensure every deployed model artifact is identifiable, reproducible, and safe to promote.

## Scope
Applies to model weights, adapters, tokenizers, configuration, compiled engines, and associated metadata.

## MUST
- Every artifact MUST have an immutable version or digest tied to its source and build inputs.
- Deployment manifests MUST reference immutable artifacts, not mutable aliases.
- Required runtime, tokenizer, architecture, and precision metadata MUST be recorded with the artifact.
- Artifact integrity MUST be verified before promotion.

## MUST NOT
- MUST NOT deploy an artifact whose provenance cannot be established.
- MUST NOT replace an artifact in place under an existing immutable version.

## SHOULD
- Artifacts SHOULD include machine-readable compatibility metadata and evaluation references.

## Exceptions
Any exception requires documented reason, risk, evidence, rollback plan, and approval.

## Verification
Inspect registry metadata, digests, build records, deployment manifests, and promotion logs.