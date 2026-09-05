# SBOM and Dependency Rules

## Purpose
Maintain actionable knowledge of software components embedded in container images so risk can be assessed and traced quickly.

## Scope
Applies to software bills of materials, operating-system packages, language dependencies, embedded binaries, and third-party components.

## MUST
- Production images MUST have an SBOM or equivalent component inventory generated from the final artifact when supported by the build platform.
- Component inventories MUST be tied to immutable image identity.
- Dependency sources and versions MUST be reproducible enough to support vulnerability and license investigation.
- Material dependency changes MUST be reviewable in code or build metadata.
- SBOM generation failures for required workloads MUST block promotion unless explicitly approved.

## MUST NOT
- MUST NOT treat source lockfiles alone as a complete inventory of final image contents.
- MUST NOT discard SBOMs before the associated image leaves supported service.
- MUST NOT silently introduce unmanaged binaries into runtime images.

## SHOULD
- Include package provenance, hashes, and relationships where tooling supports them.
- Compare SBOM changes between releases to identify unexpected components.

## Exceptions
Exceptions require documented tooling limitation, alternative inventory evidence, risk assessment, and approval.

## Verification
Inspect generated SBOMs, image digests, package inventories, dependency diffs, and build records.