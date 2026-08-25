# Artifact Integrity Rules

## Purpose
Protect release artifacts from substitution, corruption, and provenance loss.

## Scope
Packages, containers, binaries, manifests, SBOMs, signatures, and registries.

## MUST
- Release artifacts MUST be immutable after publication or addressed by immutable digest/version.
- Promotion and deployment MUST identify artifacts by an immutable identity.
- Artifact repositories MUST enforce authenticated writes and least-privilege permissions.
- Integrity or signature verification MUST occur before deployment where supported by the delivery architecture.
- Provenance MUST link a release artifact to its source revision and producing pipeline.

## MUST NOT
- MUST NOT overwrite a released version with different content.
- MUST NOT deploy an artifact whose provenance is unknown when provenance is required by the release process.
- MUST NOT rely solely on mutable tags for production identity.

## SHOULD
- Critical artifacts SHOULD be signed using managed keys or workload identity.
- Retention policies SHOULD preserve artifacts needed for rollback, audit, and incident investigation.

## Exceptions
Legacy constraints require documented risk, compensating integrity checks, migration plan, and approval.

## Verification
Compare registry digests across environments, inspect repository ACLs, validate signatures/provenance, confirm overwrite protection, and test that deployment rejects unauthorized or mismatched artifacts.