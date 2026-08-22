# Supply Chain Provenance

## Purpose
Establish verifiable evidence describing where release artifacts came from, how they were built, and which inputs they contain.

## When to use
Use for production release pipelines, regulated environments, signed artifacts, SBOM initiatives, or supply-chain risk reduction.

## Inputs
Source repositories, build identities, dependency metadata, artifact registries, signing infrastructure, CI identities, and security requirements.

## Preconditions
Build execution has a stable machine or workload identity and artifacts are stored in a controlled registry.

## Context to inspect
Inspect CI permissions, source checkout controls, dependency sources, artifact upload paths, signing keys or keyless identities, SBOM generation, attestations, and verification policy.

## Core knowledge
Provenance should bind source revision, build process, builder identity, dependencies, and artifact digest. Signing proves association with an identity, not that the artifact is safe. Verification policy must define which identities and build paths are trusted.

## Procedure
1. Define the trust boundary from source to production.
2. Identify authoritative builder identities.
3. Generate immutable artifact digests.
4. Generate dependency inventory or SBOM where applicable.
5. Produce provenance attestations from the build system.
6. Sign artifacts or attestations using controlled identities.
7. Store evidence alongside or addressable from the artifact.
8. Verify provenance before promotion to protected environments.
9. Restrict bypass paths and audit exceptions.
10. Test verification failure scenarios.

## Decision points
Prefer short-lived or workload-bound signing identities over widely shared long-lived secrets. Enforce provenance at promotion/deploy time when bypass prevention matters.

## Common failure patterns
Signing after artifacts leave the trusted pipeline, storing private keys in repository secrets with broad access, generating SBOMs without linking them to artifact digests, and collecting attestations that deployment never verifies.

## Verification
Tamper with an artifact or provenance field and confirm promotion fails. Confirm a production digest resolves to source, builder, dependencies, and signing identity.

## Expected output
A provenance chain and enforcement policy that operators can independently verify.

## Stop conditions
Stop when signing identity ownership is unclear, artifact digests are mutable, CI cannot protect provenance generation, or required verification controls cannot be enforced.