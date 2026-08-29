# SBOM Rules

## Purpose
Maintain an accurate inventory of software components in released artifacts.

## Scope
Applies to applications, services, containers, packages, firmware-like bundles, and deployable artifacts where an SBOM is relevant.

## MUST
- Release artifacts MUST have an SBOM when required by project risk, policy, customer, or regulatory obligations.
- SBOMs MUST identify direct and transitive components to the extent supported by the build ecosystem.
- SBOM generation MUST occur from the release build or an equivalent trusted stage.
- SBOMs MUST be retained with release records and associated with a specific artifact version or digest.

## MUST NOT
- MUST NOT treat a stale manually maintained dependency list as an SBOM.
- MUST NOT publish sensitive internal metadata beyond approved disclosure requirements.

## SHOULD
- SBOMs SHOULD use a standard machine-readable format.
- Component identifiers SHOULD be specific enough to support vulnerability correlation.

## Exceptions
Exceptions MUST document why complete inventory is unavailable, the missing scope, risk, compensating controls, owner, and approval.

## Verification
Compare SBOM entries with package manifests, lockfiles, container layers, and artifact composition. Confirm the SBOM maps to the exact released artifact.