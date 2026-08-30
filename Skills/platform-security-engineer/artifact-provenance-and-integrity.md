# Artifact Provenance and Integrity

## Purpose
Ensure software artifacts consumed or deployed through the platform are traceable to trusted source, build processes, and approved dependencies, and cannot be silently replaced or tampered with.

## When to use
Use when designing artifact registries, release promotion, build pipelines, deployment admission, dependency controls, or supply-chain incident response.

## Inputs
Artifact registries, build metadata, signing or attestation systems, SBOMs, CI identities, deployment manifests, retention policies, and release workflows.

## Context to inspect
Inspect artifact naming and mutability, digest use, build isolation, signing identities, provenance generation, verification boundaries, registry permissions, mirrors, promotion workflow, and rollback artifacts.

## Core knowledge
Integrity requires immutable identification, trustworthy provenance, constrained writers, and verification at the consumption boundary. A signature is only useful when the signer identity, protected build process, and verification policy are trustworthy.

## Procedure
1. Map source-to-build-to-registry-to-deployment flow.
2. Identify who can write, overwrite, delete, and promote artifacts.
3. Require digest-based immutable artifact references for sensitive deployments.
4. Generate provenance from trusted build identities.
5. Sign or attest artifacts using protected signing identities.
6. Produce SBOMs where useful for vulnerability and dependency analysis.
7. Separate artifact build from promotion authorization.
8. Verify provenance and integrity before deployment or package consumption.
9. Restrict mutable tags and administrative registry access.
10. Retain known-good rollback artifacts and provenance.
11. Monitor unexpected writers, overwrites, signature failures, and provenance gaps.
12. Test tampered artifact, unsigned artifact, wrong-builder, and stale-attestation cases.

## Decision points
Use blocking verification for production or high-impact platform components. Use advisory verification temporarily only during controlled migration with measured gaps.

## Common failure patterns
Trusting tags instead of digests, signing on developer laptops, allowing broad registry write access, producing attestations without verifying them, and rebuilding artifacts during promotion.

## Verification
Verify tampered or untrusted artifacts are rejected, deployed digests map to source and build evidence, signer permissions are scoped, and rollback artifacts remain verifiable.

## Expected output
An end-to-end artifact trust chain with immutable references, provenance, verification policy, and auditable promotion.

## Stop conditions
Stop when provenance cannot be tied to a trustworthy build identity, registry mutation cannot be controlled, or production consumes artifacts outside the verified path.