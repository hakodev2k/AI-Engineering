# Model Artifact Integrity Rules

## Purpose
Prevent unauthorized substitution, tampering, or corruption of model artifacts.

## Scope
Applies to checkpoints, serialized models, tokenizer assets, preprocessing objects, compiled engines, and related metadata.

## MUST
- Store release artifacts in controlled repositories with immutable version identifiers.
- Verify cryptographic hashes or signatures before promotion and deployment.
- Bind each promoted artifact to its source revision, training dataset version, configuration, and evaluation record.
- Restrict artifact publication and replacement privileges to authorized identities.

## MUST NOT
- Deploy model artifacts from ad hoc local paths, chat attachments, or unverified external storage.
- Deserialize untrusted model formats in privileged environments without isolation and format-specific risk review.
- Reuse a release version identifier for different artifact bytes.

## SHOULD
- Prefer non-executable serialization formats where capability permits.
- Sign high-risk model releases and verify signatures at deployment boundaries.

## Exceptions
Recovery from legacy unsigned artifacts requires independent integrity evidence, isolated validation, and approval.

## Verification
Check artifact hashes, signatures, registry ACLs, provenance links, deployment manifests, and release audit records.