# Model Artifact Integrity Rules

## Purpose
Ensure model weights, adapters, tokenizers, configuration, and related artifacts are authentic and unchanged from approved versions.

## Scope
Applies to model checkpoints, adapters, quantized variants, tokenizers, configuration files, serialized pipelines, and registry artifacts.

## MUST
- Production model artifacts MUST have immutable version identifiers and integrity evidence.
- Artifact promotion MUST preserve the exact approved bytes or an explicitly reviewed transformation.
- Serialization formats and loaders MUST be assessed for code-execution risk before use.
- Artifact stores MUST restrict modification and deletion to authorized identities.
- Unexpected hash or signature changes MUST block promotion pending investigation.

## MUST NOT
- MUST NOT load arbitrary untrusted serialized objects in privileged environments.
- MUST NOT silently replace a production model under an existing immutable version identifier.
- MUST NOT rely on filenames as integrity proof.

## SHOULD
- Use content-addressed storage or cryptographic hashes.
- Keep provenance linking training run, evaluation evidence, approvals, and deployed artifact.

## Exceptions
Exceptions require documented transformation steps, independently verifiable outputs, risk analysis, and approval.

## Verification
Compare hashes or signatures, inspect registry permissions, verify immutable versioning, review loader behavior, and trace deployed artifacts back to approved evaluation records.