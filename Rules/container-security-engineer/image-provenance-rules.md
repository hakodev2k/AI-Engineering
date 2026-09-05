# Image Provenance Rules

## Purpose
Ensure every container image used in controlled environments is traceable to an approved source and build process.

## Scope
Applies to base images, application images, build artifacts, registries, attestations, signatures, and deployment references.

## MUST
- Production images MUST be referenced by immutable digest or an equivalent content-addressable identifier.
- Image provenance MUST trace to the source revision, build pipeline, builder identity, and artifact registry record.
- Required signatures and provenance attestations MUST be verified before promotion when the delivery platform supports verification.
- Build metadata MUST identify the toolchain and material inputs sufficient to investigate or reproduce the artifact.
- Promotion MUST deploy the exact artifact that passed validation.

## MUST NOT
- MUST NOT use mutable tags as the sole production identity.
- MUST NOT deploy images of unknown origin or with missing required provenance.
- MUST NOT rebuild or substitute an approved image during production promotion without repeating required validation.

## SHOULD
- Use signed images, trusted builders, and verifiable attestations.
- Retain provenance records for the supported rollback and audit period.

## Exceptions
Exceptions require documented reason, missing evidence, compensating controls, risk, duration, and explicit approval.

## Verification
Inspect digests, registry metadata, signatures, attestations, build records, and deployment manifests.