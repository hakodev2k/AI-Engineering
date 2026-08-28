# Model Artifact Rules

## Purpose
Protect model artifacts from corruption, ambiguity, and unauthorized change.

## Scope
Applies to checkpoints, weights, tokenizer files, adapters, manifests, and serving artifacts.

## MUST
- Every production artifact MUST have immutable identity, version, checksum, provenance, and owner metadata.
- Artifact promotion MUST distinguish build, validation, approval, and release stages.
- Storage policy MUST define retention, replication, encryption, and recovery requirements.
- Consumers MUST fail safely when artifact integrity validation fails.

## MUST NOT
- MUST NOT overwrite an artifact version already referenced by production or evaluation records.
- MUST NOT promote artifacts without reproducible provenance.
- MUST NOT expose restricted model artifacts through public or broadly accessible storage.

## SHOULD
- Large artifacts SHOULD use content-addressable or equivalent integrity-preserving storage.
- Retention SHOULD reflect reproducibility, audit, and cost requirements.

## Exceptions
Exceptions require provenance evidence, security review, bounded duration, and explicit approval.

## Verification
Inspect artifact metadata, checksums, ACLs, retention policies, promotion logs, replication status, and restore tests.