# Versioning and Artifact Rules

## Purpose
Guarantee that the release candidate approved, tested, deployed, and audited is the same immutable software or configuration artifact.

## Scope
Applies to binaries, containers, packages, infrastructure artifacts, configuration bundles, schemas, migration packages, and client deliverables.

## MUST
- Every production artifact MUST have an immutable identifier such as digest, checksum, signed version, or commit-derived build identity.
- Promotion MUST use the artifact that passed the required gates rather than rebuilding equivalent source for production where avoidable.
- Release records MUST map human-readable versions to immutable artifact identities.
- Artifact provenance and integrity MUST be verifiable for risk-sensitive releases.
- Replaced, withdrawn, or superseded candidates MUST be clearly invalidated to prevent accidental promotion.

## MUST NOT
- Mutable tags such as `latest` MUST NOT be the sole identity used for production approval.
- An artifact changed after testing MUST NOT retain the previous readiness status.
- Untrusted or unverifiable artifacts MUST NOT be promoted merely because their filename or tag appears correct.

## SHOULD
- Artifacts SHOULD be signed or attested when supported by the delivery platform and risk profile.
- Release tooling SHOULD prevent promotion when recorded candidate identity and deployment input differ.

## Exceptions
If immutable identity cannot be provided, the release requires documented integrity controls, reason, residual risk, independent verification, and approval appropriate to the risk.

## Verification
Compare artifact registry metadata, digests/checksums, build provenance, signatures or attestations, release records, CI evidence, and deployment logs. Confirm the deployed identity exactly matches the approved candidate.