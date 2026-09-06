# Storage and Retention Rules

## Purpose
Keep model artifacts available for active operations, rollback, audit, and reproducibility while controlling storage growth.

## Scope
Artifact stores, metadata stores, lifecycle policies, retention, archival, deletion, and tiering.

## MUST
- Retention policy MUST distinguish active, rollback-required, audit-required, and disposable artifacts.
- Artifact deletion MUST verify that no active deployment, required rollback path, legal hold, or reproducibility requirement depends on the version.
- Archived models MUST remain traceable to their metadata and lineage records.
- Storage lifecycle actions MUST be auditable.

## MUST NOT
- MUST NOT delete production history solely to reduce cost when it is still required for rollback, incident analysis, or compliance.
- MUST NOT orphan metadata from artifacts or artifacts from their provenance without an explicit archival strategy.
- MUST NOT apply automatic deletion to governed models without eligibility checks.

## SHOULD
- Use lower-cost storage tiers for inactive but retained artifacts.
- Periodically review retention exceptions and abandoned versions.

## Exceptions
Exceptions require documented retention need, owner, expiry where applicable, and storage-impact review.

## Verification
Inspect lifecycle policies, dependency checks, deletion audits, archival tests, and sampled restore operations.