# SBOM Rules

## Purpose
Provide accurate software bills of materials that support vulnerability response, customer assurance, compliance, and incident investigation.

## Scope
Applies to production applications, deployable services, distributed binaries, container images, firmware, and other releasable artifacts where component inventory is relevant.

## MUST
- SBOMs MUST be generated from actual build or package resolution data for production releases when tooling supports it.
- SBOM entries MUST identify components with versions or immutable identifiers sufficient for vulnerability correlation.
- The SBOM associated with a release MUST be retained or reproducible for the supported lifetime of that release.
- SBOM generation failures on designated critical release paths MUST block release unless an approved exception exists.
- Generated SBOMs MUST be protected against unauthorized modification and associated with the correct artifact digest.

## MUST NOT
- An SBOM MUST NOT be represented as complete when known build-time or runtime components are systematically excluded without disclosure.
- Teams MUST NOT reuse an old SBOM for a changed artifact without verifying equivalence.

## SHOULD
- Standard machine-readable formats SHOULD be used.
- SBOMs SHOULD include dependency relationships and supplier/source metadata when reliably available.

## Exceptions
Exceptions require documented missing coverage, impact, compensating inventory evidence, owner, expiration, and approval.

## Verification
Compare SBOM output with manifests, lockfiles, image layers, build logs, artifact digests, and dependency scanners; test release-to-SBOM traceability.